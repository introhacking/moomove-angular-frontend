import { Component, EventEmitter, Output, Input, OnInit, OnChanges } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-quotation-page',
  templateUrl: './quotation-page.component.html',
  styleUrls: ['./quotation-page.component.scss']
})
export class QuotationPageComponent implements OnInit, OnChanges {


  @Input() formData: any;
  @Input() isQuotaVisible: boolean | undefined;
  @Output() visibilityChange = new EventEmitter<boolean>();


  quotation: any
  totalAmount: number = 0
  // expenses_subtotal: number = 82417
  expenses_subtotal: number = 0
  // shipment_Date: any
  quantity: any
  subTotalQuotationRate: any
  comodity: any = 'any'
  weight: any = 'any'
  incoterms: any
  company: any
  loginEmail: any
  customerData: any = {}
  loginQuotaUsername: any
  loginQuotaEmail: any
  todayDate: string = new Date().toISOString().split('T')[0]; // Current date for validFrom




  constructor(private apiServiceService: ApiServiceService) { }


  // ngOnInit(){
  //   this.quotation = this.apiServiceService.quotation
  //   this.comodity = this.apiServiceService.comodity
  //   this.weight = this.apiServiceService.weight
  //   this.incoterms = this.apiServiceService.incoterms
  //   this.shipment_Date = this.apiServiceService.shipment_Date
  //   this.quantity = this.apiServiceService.quantity
  //   this.subTotalQuotationRate = this.quantity * this.quotation.rate
  //   this.totalAmount = +this.subTotalQuotationRate + this.expenses_subtotal
  //   console.log("quotation ", this.quotation);

  //   console.log(this.isQuotaVisible)

  //   if (this.isQuotaVisible) {
  //     console.log('Quotation Data:', this.formData);
  //   }
  // }

  // ngOnChanges() {
  //   if (this.isQuotaVisible) {
  //     console.log('Form Data:', this.formData);
  //   }
  // }


  ngOnInit() {
    this.populateQuotationData();
    this.getCustomerInfoData()
  }

  ngOnChanges() {
    if (this.isQuotaVisible) {
      this.populateQuotationData();  // Update data whenever the modal is opened
    }
  }

  populateQuotationData(): void {
    if (this.formData) {
      this.quotation = this.formData;
      this.comodity = (this.quotation.comodity || this.apiServiceService.comodity) || 'any';
      this.weight = this.quotation.weight || this.apiServiceService.weight || 'any';
      this.incoterms = this.quotation.incoterms || this.apiServiceService.incoterms || 'any';
      // Check if it's bulk or single quotation
      if (this.quotation?.bulkQuotations && this.quotation?.bulkQuotations?.length > 1) {
        // Bulk Quotation Handling
        this.subTotalQuotationRate = this.quotation?.bulkQuotations?.map((bulkQuotation: any) => {
          const quantity = bulkQuotation.quantity || 1;
          const rate = bulkQuotation.rate || 1;
          return parseFloat((quantity * rate).toFixed(2)); // Individual subtotal
        });

        // Total for all bulk quotations
        this.subTotalQuotationRate = this.subTotalQuotationRate.reduce((sum: any, rate: any) => sum + rate, 0);
        this.totalAmount = this.subTotalQuotationRate + (this.expenses_subtotal || 0);

        // CALCULATE PERCENTAGE
        this.totalAmount = this.totalAmount * (this.quotation?.customerData?.percentage / 100);
      } else {
        // Single Quotation Handling
        this.quantity = this.quotation.quantity || this.apiServiceService.quantity || 1;
        const rate = this.quotation.rate || 0;
        this.subTotalQuotationRate = parseFloat((this.quantity * rate).toFixed(2));
        this.totalAmount = this.subTotalQuotationRate + (this.expenses_subtotal || 0);
        // CALCULATE PERCENTAGE
        this.totalAmount = this.totalAmount * (this.quotation?.customerData?.percentage / 100);
      }

      // this.quantity = this.quotation.quantity || this.apiServiceService.quantity;
      // this.subTotalQuotationRate = this.quantity * this.quotation.rate;
      // this.totalAmount = +this.subTotalQuotationRate + this.expenses_subtotal;

      this.loginQuotaUsername = this.quotation.loginDetails?.username;
      this.loginQuotaEmail = this.quotation.loginDetails?.email;
      console.log('Quotation Data:', this.quotation);

      // console.log(this.subTotalQuotationRate)
      // POPULATE CUSTOMER DATA HERE
      this.customerData = this.formData.customerData
    } else {
      console.warn('Form Data is undefined or null');
    }
  }

  getFormattedTranshipmentPort(quotation: any): string {
    return quotation?.transhipment_add_port?.replace(/,/g, ' -') || '';
  }


  getDisplayWeight(): string {
    // If weight is an object and has the 'weight' property, return it
    if (typeof this.weight === 'object' && this.weight?.weight) {
      return this.weight.weight;
    }

    // If weight is not an object and not an empty string, return the weight
    if (this.weight !== '' && typeof this.weight !== 'object') {
      return this.weight;
    }

    // Otherwise, return 'any'
    return 'any';
  }
  getDisplayCommodity(): string {
    // If weight is an object and has the 'weight' property, return it
    if (typeof this.comodity === 'object' && this.comodity?.comodity) {
      return this.comodity.comodity;
    }

    // If comodity is not an object and not an empty string, return the comodity
    if (this.comodity !== '' && typeof this.comodity !== 'object') {
      return this.comodity;
    }

    // Otherwise, return 'any'
    return 'any';
  }


  closeModal() {
    this.isQuotaVisible = false;
    this.visibilityChange.emit(this.isQuotaVisible);
  }

  download_pdf() {
    const element = document.getElementById('quotation');
    if (!element) {
      console.error('Element #pdfContent not found.');
      return;
    }
    html2canvas(element).then(canvas => {
      const contentDataUrl = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4')
      var width = pdf.internal.pageSize.getWidth();
      var height = canvas.height * width / canvas.width;
      pdf.addImage(contentDataUrl, 'png', 0, 0, width, height)
      pdf.save('Quotation.pdf')
    })

  }
  //  FOR GET
  getCustomerInfoData() {
    try {
      this.apiServiceService.getCompanyList('/api/customer/').subscribe(response => {
        console.log(response)
      })

    } catch (err) {

    }
  }
  // FOR POST 
  addCustomerInfoData() {
    try {
      this.apiServiceService.addManualRate('/api/customer/', '').subscribe(response => {
        console.log(response)
      })

    } catch (err) {

    }
  }
}
