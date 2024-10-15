import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-shipment-quote-generation',
  templateUrl: './shipment-quote-generation.component.html',
  styleUrls: ['./shipment-quote-generation.component.scss']
})
export class ShipmentQuoteGenerationComponent {
  // source: any
  // destination: any
  // equipments: any
  // shipment_Date: any
  // quantity: any = 1
  sourceList: any = []
  destinationList: any = []
  equipmentsList: any = []
  comodityList: any = []
  incotermsList: any = []
  todayDate: any
  // commodity: any
  // weight: any
  // incoterms: any
  commodityFormData!: FormGroup
  incotermsFormData!: FormGroup
  addCustomerFormData!: FormGroup
  addEquipmentsFormData!: FormGroup
  closeDialouge: any;

  // RESULT
  source: any
  destination: any
  equipments: any
  shipment_Date: any
  quantity: any = 1
  shipdata: any = [];
  currentDate: any;
  commodity: any;
  incoterms: any = 'FCA';
  weight: number = 0;
  isLoading: boolean = false;
  dataChecked: boolean = false;
  freeDays: any
  isRateFrozenIdx: any = ''

  modalStatus: boolean | null = false;
  serverResposeMessage: any = '';

  localStorageUsername: string | null = null;
  localStorageEmail: string | null = null;

  // Quotaton here
  isQuotaData: any = []
  modifiedQuotaData: any = {}
  isQuotaModalVisible = false;

  formData!: FormGroup;
  findBestRoute!: FormGroup;
  // FOR CUSTOMER SEARCH
  showDropdown: boolean = false;
  filteredCustomer: any[] = [];
  customerInputValue: string = '';

  customerLists: any[] = []
  showCustomerDropdown: boolean = false;
  selectedCustomerId: number | null = null;
  selectedCustomerData: any;

  @Input() isVisible = false;
  @Output() visibilityChange = new EventEmitter<boolean>();


  constructor(private route: Router, public apiServiceService: ApiServiceService, private fb: FormBuilder) { }
  ngOnInit() {

    // RESULT
    // this.source1 = this.apiServiceService.source
    // this.destination1 = this.apiServiceService.destination
    // this.equipments1 = this.apiServiceService.equipments
    // this.shipment_Date1 = this.apiServiceService.shipment_Date
    // this.quantity1 = this.apiServiceService.quantity
    this.getCurrentDateFormatted();
    // if (this.source1) {
    //   this.getshipmentData()
    // }

    //   END

    this.getSource()
    this.getDestination()
    this.getEquipments()
    this.getComodity()
    this.getIncoterms()
    this.getCustomerDetails()
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.todayDate = yyyy + '-' + mm + '-' + dd;


    this.commodityFormData = this.fb.group({
      name: ''
    })
    this.incotermsFormData = this.fb.group({
      rule: ''
    })

    this.formData = this.fb.group({
      customerName: ['', Validators.required],
    })

    this.addEquipmentsFormData = this.fb.group({
      equipmentName: ['', Validators.required],
    })

    this.addCustomerFormData = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', Validators.required],
      customerPhone: ['', Validators.required],
      terms_condition: ['', Validators.required],
      saleRepresent: ['', Validators.required],
    })



    this.findBestRoute = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required],
      shipment_Date: ['', Validators.required],
      equipments: ['', Validators.required],
      commodity: ['', Validators.required],
      quantity: ['', Validators.required],
      incoterms: ['', Validators.required],
      weight: ['', Validators.required],

    });
  }




  //  START

  // Method to format the number to 2 decimal places

  formatToFixed(value: any): number {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : Math.floor(num);
  }


  getCurrentDateFormatted(): any {
    const currentDate: Date = new Date();

    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1; // Note: getMonth() returns 0-based index
    const day: number = currentDate.getDate();

    // Ensure month and day are formatted to have leading zeros if necessary
    const formattedMonth: string = month < 10 ? `0${month}` : `${month}`;
    const formattedDay: string = day < 10 ? `0${day}` : `${day}`;

    // Construct the formatted date string
    this.currentDate = `${year}-${formattedMonth}-${formattedDay}`;

  }

  getshipmentData() {
    // this.apiServiceService.getShipmentData(this.source, this.destination, this.equipments).subscribe(res => {
    this.apiServiceService.getShipmentData(this.source, this.destination).subscribe(res => {
      // console.log(">>", res);
      if (res.length > 0 || res.length === 0) {
        this.shipdata = res
        this.isLoading = false
        this.dataChecked = true;
        // console.log(this.shipdata)
      }
    })
  }



  //  END



  getSource() {
    this.apiServiceService.getCompanyList('/api/source/').subscribe(res => {

      this.sourceList = res
    })
  }

  getDestination() {
    this.apiServiceService.getCompanyList('/api/destination/').subscribe(res => {
      this.destinationList = res

    })
  }
  getComodity() {
    this.apiServiceService.getCompanyList('/api/commodities/').subscribe(res => {
      this.comodityList = res

    })
  }
  getIncoterms() {
    this.apiServiceService.getCompanyList('/api/incoterms/').subscribe(res => {
      this.incotermsList = res
    })
  }

  submitCommodity() {
    this.apiServiceService.submitFileData('/api/commodities/', this.commodityFormData.value).subscribe(res => {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Added Successfully"
      });
      this.getComodity()

    })

  }
  submitIncoterms() {
    this.apiServiceService.submitFileData('/api/incoterms/', this.incotermsFormData.value).subscribe(res => {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 12000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Added Successfully"
      });
      this.getIncoterms()

    })

  }

  getEquipments() {
    this.apiServiceService.getCompanyList('/api/frighttype/').subscribe(res => {

      this.equipmentsList = res

    })
  }

  findBestRates() {
    this.isLoading = true
    this.dataChecked = false;

    this.apiServiceService.source = this.source || {}
    this.apiServiceService.destination = this.destination || {}
    this.apiServiceService.equipments = this.equipments || {}
    this.apiServiceService.shipment_Date = this.shipment_Date || {}
    this.apiServiceService.quantity = this.quantity || {}
    this.apiServiceService.comodity = this.commodity || {}
    this.apiServiceService.weight = this.weight || {}
    this.apiServiceService.incoterms = this.incoterms || {}

    if (this.source) {
      setTimeout(() => {
        this.getshipmentData();
        // this.isLoading=false
      }, 2000)
    }
  }

  handleQuotaVisibilityChange(isQuotaVisible: boolean) {
    this.isQuotaModalVisible = isQuotaVisible;
  }
  generateQuote(quoteDataIdx: any) {
    this.shipdata.map((ele: any) => {
      if (ele.id == quoteDataIdx) {
        this.apiServiceService.quotation = ele
        this.modifiedQuotaData = ele
        this.isRateFrozenIdx = quoteDataIdx
      }
    })
    // this.route.navigate(['quotation_page']);

  }

  getLoginInfo() {
    // Retrieve username and email from localStorage
    this.localStorageUsername = JSON.parse(`${localStorage.getItem('UserData')}`).username;
    this.localStorageEmail = JSON.parse(`${localStorage.getItem('UserData')}`).email;
  }

  updatingFrozenRate(forzenIdx: any) {
    this.apiServiceService.updatingManualRate(`/api/manual-rate/${forzenIdx}/`, { isRateUsed: true }).subscribe(response => {
      console.log(response)
    })

  }


  submitCustomer(rateFrozenId: any) {

    if (this.selectedCustomerData) {
      this.getLoginInfo()
      // Log the retrieved values
      const loginDetails = {
        username: this.localStorageUsername,
        email: this.localStorageEmail,
      }
      this.isQuotaData = { ...this.modifiedQuotaData, customerData: this.selectedCustomerData, loginDetails: loginDetails };
      this.isQuotaModalVisible = true;
      this.formData.get('customerName')!.reset();
      this.selectedCustomerData = null;

      // this.updatingFrozenRate(rateFrozenId)
    }
    else {
      alert('No customer selected');
    }
  }


  selectedTab: string = 'FCL'; // Default selected tab
  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  getCustomerDetails() {
    this.apiServiceService.getCompanyList('/api/customer/').subscribe(response => {
      this.customerLists = response
    })
  }

  onInput(event: any): void {
    // const value = event.target.value.toLowerCase();
    // this.filteredCustomer = this.customerLists.filter((customer: any) =>
    //   customer.cust_name.toLowerCase().includes(value)
    // );
    this.customerInputValue = event.target.value;
    // Perform filtering based on the input value
    if (this.customerInputValue.length >= 2) {
      // Example of filtering logic: Update the filteredCompanies array based on input
      this.filteredCustomer = this.filterCustomer(this.customerInputValue);
    } else {
      // If input length is less than 2, do not show filtered results
      this.filteredCustomer = [];
    }

  }

  filterCustomer(query: string) {
    return this.customerLists.filter((customer: any) =>
      customer.cust_name.toLowerCase().includes(query.toLowerCase())
    );

  }

  selectCustomer(customer: any) {

    this.formData.get('customerName')!.setValue(customer.cust_name); // Set the selected customer name in form
    this.selectedCustomerData = customer; // Store the selected customer ID
    this.showDropdown = false;
  }
  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 100); // Delay to allow click event to register before hiding
  }

  addCustomerData() {
    const preparingPostData = {
      cust_name: this.addCustomerFormData.value.customerName,
      cust_email: this.addCustomerFormData.value.customerEmail,
      phone: this.addCustomerFormData.value.customerPhone,
      sales_represent: this.addCustomerFormData.value.saleRepresent,
      terms_condition: this.addCustomerFormData.value.terms_condition
    }
    try {
      this.apiServiceService.addManualRate('/api/customer/', preparingPostData).subscribe(response => {

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: `${this.addCustomerFormData.value.customerName.toUpperCase()} Added Successfully`
        });
        this.addCustomerFormData.reset();
        this.getCustomerDetails()
      })
    } catch (err) {

    }
  }

  submitEquipments() {
    const preparingPostData = {
      type: this.addEquipmentsFormData.value.equipmentName
    }
    try {

      if (this.addEquipmentsFormData.invalid) {
        this.addEquipmentsFormData.markAllAsTouched();
        return;
      }
      this.apiServiceService.addManualRate('/api/frighttype/', preparingPostData).subscribe(response => {
        // console.log(response)
        if (response.message === 'already exists') {
          this.serverResposeMessage = 'This equipment already exists'
          this.modalStatus = false
          return
        }
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: `${this.addEquipmentsFormData.value.equipmentName.toUpperCase()} Added Successfully`
        });
        this.addEquipmentsFormData.reset();
        this.getEquipments()
        this.modalStatus = true
        this.serverResposeMessage = ''

      })
    } catch (error) {
      // console.log(error)
    }
  }
}

