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
  modalAddCustomerStatus: boolean | null = false;
  serverResposeMessage: any = '';

  localStorageUsername: string | null = null;
  localStorageEmail: string | null = null;

  // BULK QUOTATION GENERATION
  bulkQuotationGeneration: any = []

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

  emailList: string[] = [];  // Holds the list of added emails
  emailError: string = '';
  parsedData: any = {}
  editModeStatus: boolean = false;


  isEditCustomerData!: FormGroup;
  customerUpdatingId: number | null = null

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
      // countryCode: ['+91', Validators.required],
      companyName: ['', Validators.required],
      customerName: ['', Validators.required],
      customerEmail: [''],
      customerPhone: ['', [Validators.required, Validators.pattern('^\\+[1-9]{1,3}[0-9]{10}$')]],
      terms_condition: ['', Validators.required],
      saleRepresent: ['', Validators.required],
      percentageMargin: [''],
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


    this.isEditCustomerData = this.fb.group({
      edit_customer: [''],
      percentage: ['']
    })



    const activity_log = localStorage.getItem('UserData');
    this.parsedData = activity_log ? JSON.parse(activity_log) : {};
  }

  countryCodeList = [
    { code: '+61', country: 'Australia' },
    { code: '+43', country: 'Austria' },
    { code: '+880', country: 'Bangladesh' },
    { code: '+32', country: 'Belgium' },
    { code: '+55', country: 'Brazil' },
    { code: '+86', country: 'China' },
    { code: '+20', country: 'Egypt' },
    { code: '+33', country: 'France' },
    { code: '+49', country: 'Germany' },
    { code: '+233', country: 'Ghana' },
    { code: '+91', country: 'India' },
    { code: '+62', country: 'Indonesia' },
    { code: '+98', country: 'Iran' },
    { code: '+81', country: 'Japan' },
    { code: '+254', country: 'Kenya' },
    { code: '+60', country: 'Malaysia' },
    { code: '+52', country: 'Mexico' },
    { code: '+212', country: 'Morocco' },
    { code: '+31', country: 'Netherlands' },
    { code: '+47', country: 'Norway' },
    { code: '+92', country: 'Pakistan' },
    { code: '+48', country: 'Poland' },
    { code: '+351', country: 'Portugal' },
    { code: '+7', country: 'Russia' },
    { code: '+65', country: 'Singapore' },
    { code: '+34', country: 'Spain' },
    { code: '+94', country: 'Sri Lanka' },
    { code: '+27', country: 'South Africa' },
    { code: '+82', country: 'South Korea' },
    { code: '+90', country: 'Turkey' },
    { code: '+971', country: 'United Arab Emirates' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+1', country: 'United States' },
  ];
  selectedCountryCode = '+91'; // Default country code

  // Method to handle email input and adding them to the list
  addEmail(emailInput: HTMLInputElement): void {
    const inputValue = emailInput.value.trim(); // Get the email value
    this.emailError = '';  // Reset error

    // Split input by commas and validate each email
    const emails = inputValue.split(',').map((email: any) => email.trim()).filter((email: any) => email !== '');

    emails.forEach((email: any) => {
      if (this.validateEmail(email)) {
        if (!this.emailList.includes(email)) {
          this.emailList.push(email);  // Add email to the list
        } else {
          this.emailError = 'Email already exists';
        }
      } else {
        this.emailError = 'Invalid email format';
      }
    });

    // Clear the input field after processing
    emailInput.value = '';
  }

  // Method to validate email format
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Method to remove an email from the list
  removeEmail(email: string): void {
    this.emailList = this.emailList.filter(e => e !== email);
  }

  // Method to check if form can be submitted
  canSubmitForm(): boolean {
    return this.emailList.length > 0 && this.addCustomerFormData.valid;
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
        // console.log(res)
        this.isLoading = false
        this.dataChecked = true;
        // console.log(this.shipdata)
        if (this.shipdata.length > 0) {
          const log = {
            userId: this.parsedData.userId,
            action_type: 'Finding Quick Qoute',
            description: `Finding best rate from ${this.source} and ${this.destination}`
          }

          // this.apiServiceService.activityLogCreation('/api/activity-log/', log).subscribe((res) => {
          //   console.log(res)
          // })

        }
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
    this.bulkQuotationGeneration = []

    if (this.source) {
      setTimeout(() => {
        this.getshipmentData();
      }, 2000)
    }
  }

  handleQuotaVisibilityChange(isQuotaVisible: boolean) {
    this.isQuotaModalVisible = isQuotaVisible;
  }
  generateQuote(quoteDataIdx: any, rateFrozenIdx: any) {
    this.shipdata.map((ele: any) => {
      if (ele.id == quoteDataIdx) {
        this.apiServiceService.quotation = ele
        this.modifiedQuotaData = ele
        // console.log(ele)
        this.isRateFrozenIdx = rateFrozenIdx
      }
    })
    // this.route.navigate(['quotation_page']);
  }
  bulkGenerateQuote() {
    this.shipdata.map((ele: any) => {
      this.apiServiceService.quotation = ele
      this.modifiedQuotaData = ele
      // console.log(ele)    
    })

  }

  getLoginInfo() {
    // Retrieve username and email from localStorage
    this.localStorageUsername = JSON.parse(`${localStorage.getItem('UserData')}`).username;
    this.localStorageEmail = JSON.parse(`${localStorage.getItem('UserData')}`).email;
  }

  updatingFrozenRate(forzenIdx: any) {
    // console.log(forzenIdx)

    this.apiServiceService.updatingManualRate(`/api/frozen-rate/${forzenIdx}/`, { isRateUsed: true }).subscribe(response => {
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
      this.isQuotaData = { ...this.modifiedQuotaData, customerData: this.selectedCustomerData, loginDetails: loginDetails, bulkQuotations: this.bulkQuotationGeneration };
      this.isQuotaModalVisible = true;
      this.formData.get('customerName')!.reset();
      this.selectedCustomerData = null;
      this.updatingFrozenRate(rateFrozenId)

      const log = {
        userId: this.parsedData.userId,
        action_type: 'Create Quotation',
        action_status: true,
        description: `Create Quotation`
      }
      this.apiServiceService.activityLogCreation('/api/activity-log/', log).subscribe((res) => {
        console.log(res)
      })
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
    if (this.customerInputValue.length >= 1) {
      // Example of filtering logic: Update the filteredCompanies array based on input
      this.filteredCustomer = this.filterCustomer(this.customerInputValue);
    } else {
      // If input length is less than 1, do not show filtered results
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

  isEmailRequired(): boolean {
    return this.emailList.length === 0 &&
      (this.addCustomerFormData.get('customerEmail')!.dirty || this.addCustomerFormData.get('customerEmail')!.touched);
  }
  addCustomerData() {
    if (this.emailList.length === 0) {
      // Show error if no emails in list
      this.emailError = 'Email is required';
    } else {
      this.emailError = ''; // Reset error if emails exist
    }
    const preparingPostData = {
      company_name: this.addCustomerFormData.value.companyName,
      cust_name: this.addCustomerFormData.value.customerName,
      cust_email: this.emailList.join(','),
      phone: this.addCustomerFormData.value.customerPhone,
      sales_represent: this.addCustomerFormData.value.saleRepresent,
      terms_condition: this.addCustomerFormData.value.terms_condition,
      percentage: this.addCustomerFormData.value.percentageMargin
    }
    // console.log(preparingPostData)
    if (this.addCustomerFormData.valid) {
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
          this.selectCustomer(preparingPostData)
          this.emailList = []
          // this.modalAddCustomerStatus = !this.modalAddCustomerStatus
        })
      } catch (err) {

      }
    } else {
      // Mark all controls as touched to trigger validation errors
      this.addCustomerFormData.markAllAsTouched();
      // this.modalAddCustomerStatus = false
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

  toggleBulkQuotation(event: Event, data: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      // Add to bulkQuotationGeneration if not already included
      if (!this.bulkQuotationGeneration.some((item: any) => item.id === data.id)) {
        this.bulkQuotationGeneration.push(data);
      }
    } else {
      // Remove from bulkQuotationGeneration if unchecked
      this.bulkQuotationGeneration = this.bulkQuotationGeneration.filter((item: any) => item.id !== data.id);
    }
    // console.log(this.bulkQuotationGeneration)
  }
  // Update the selected country code
  updateCountryCode(event: Event): void {
    // const target = event.target as HTMLSelectElement;
    // this.selectedCountryCode = target.value;
    const selectedCode = (event.target as HTMLSelectElement).value;
    this.addCustomerFormData.patchValue({ countryCode: selectedCode });
  }

  addCustomerModeActive() {
    this.editModeStatus = false
    // console.log(activeStatus)
  }
  editModeActive() {
    this.editModeStatus = true
    // console.log(activeStatus)
  }
  getCustomerById(event: any) {
    const { value } = event?.target
    this.customerUpdatingId = value
    if (!value) {
      alert('No value provided to fetch customer data');
      return;
    }
    this.apiServiceService.complanyListDataById('/api/customer-id/', value).subscribe((res) => {
      if (res) {
        this.isEditCustomerData.patchValue({
          percentage: res.percentage || ''
        });
      }
    },
      (error) => {
        console.error('Error fetching customer data:', error);
      }
    )
  }
  updateCustomerPercentageMarginById(customerId: any) {
    const preparingPostData = {
      percentage: this.isEditCustomerData.value.percentage
    }
    try {
      this.apiServiceService.updatingManualRate(`/api/update-customer/${customerId}/`, preparingPostData).subscribe((res) => {
        console.log(res)
      })
    } catch (error) {
      console.log(error)

    }

  }
}

