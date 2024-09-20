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
  expenses_subtotal: number = 82417
  shipment_Date: any
  quantity: any
  subTotalQuotationRate: any
  comodity: any
  weight: any
  incoterms: any
  company: any
  loginEmail:any
  customerData: any = {}
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
    // this.addCustomerInfoData()
  }

  ngOnChanges() {
    if (this.isQuotaVisible) {
      this.populateQuotationData();  // Update data whenever the modal is opened
    }
  }

  populateQuotationData(): void {
    if (this.formData) {
      this.quotation = this.formData;
      this.comodity = this.quotation.commodity || this.apiServiceService.comodity;
      this.weight = this.quotation.weight || this.apiServiceService.weight;
      this.incoterms = this.quotation.incoterms || this.apiServiceService.incoterms;
      this.shipment_Date = this.quotation.shipment_Date || this.apiServiceService.shipment_Date;
      this.quantity = this.quotation.quantity || this.apiServiceService.quantity;
      this.subTotalQuotationRate = this.quantity * this.quotation.rate;
      this.totalAmount = +this.subTotalQuotationRate + this.expenses_subtotal;
      console.log('Quotation Data:', this.quotation);
      // POPULATE CUSTOMER DATA HERE
      this.customerData = this.formData.customerData
    } else {
      console.warn('Form Data is undefined or null');
    }
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
  getCustomerInfoData(){
    try {
      this.apiServiceService.getCompanyList('/api/customer/').subscribe(response =>{
        console.log(response)
      })
      
    } catch (err) {
      
    }
  }
  // FOR POST 
  addCustomerInfoData(){
    try {
      this.apiServiceService.addManualRate('/api/customer/','').subscribe(response =>{
        console.log(response)
      })
      
    } catch (err) {
      
    }
  }
}
