import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-rate-list',
  templateUrl: './rate-list.component.html',
  styleUrls: ['./rate-list.component.scss']
})
export class RateListComponent {
  selectedFile: File | null = null;
  selectedFileType: string | undefined;
  companyList: any = []
  sourceList: any = []
  destinationList: any = []
  fileTypesChooseName: any = []
  currentcompanyListData: any = []
  searchText: any
  dataShitForamat: any = '.sx';
  companyID: any;
  currentDate: any;
  snipperDialoug: boolean = false;
  // modal 
  // isModalVisible = false;
  manualRateLists: any = [];
  isEditData: any = {}
  isCloneData: any = {}
  isEditModalVisible = false;
  isCloneModalVisible = false;
  manualFilterChooseFromShippingLine: string = '';
  isDirectShipment: boolean = false;
  commodityFormData!: FormGroup;

  formData!: FormGroup;
  equipmentsList: any = [];
  // FOR COMPANY
  showDropdown: boolean = false;
  filteredCompanies: any[] = [];
  inputValue: string = '';
  // FOR SOURCE
  filteredSources: any[] = [];
  showSourceDropdown: boolean = false;
  sourceInputValue: string = '';
  // FOR DESTIONATION
  showDestinationDropdown: boolean = false;
  filteredDestination: any[] = [];
  destinationInputValue: string = '';

  selectedId: any = null
  isLoading: boolean = false;  // Tracks loading state
  isRateTypeStatus: boolean = true

  rateType: string = 'spot';
  hazActiveStatus: boolean = false;

  serverResposeMessage: any = ''

  sourceDestinationVia: any[] = []

  // DATE FORMATING VARIABLE
  todayDate: any

  showCurrencyDropdown: boolean = false;
  filteredCurrencies: any[] = [];
  currencyInputValue: string = '';


  currencyLists = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AED', name: 'United Arab Emirates Dirham' },
    { code: 'AFN', name: 'Afghan Afghani' },
    { code: 'ALL', name: 'Albanian Lek' },
    { code: 'AMD', name: 'Armenian Dram' },
    { code: 'ANG', name: 'Netherlands Antillean Guilder' },
    { code: 'AOA', name: 'Angolan Kwanza' },
    { code: 'ARS', name: 'Argentine Peso' },
    { code: 'AWG', name: 'Aruban Florin' },
    { code: 'AZN', name: 'Azerbaijani Manat' },
    { code: 'BAM', name: 'Bosnia - Herzegovina Convertible Mark' },
    { code: 'BBD', name: 'Barbadian Dollar' },
    { code: 'BDT', name: 'Bangladeshi Taka' },
    { code: 'BGN', name: 'Bulgarian Lev' },
    { code: 'BHD', name: 'Bahraini Dinar' },
    { code: 'BIF', name: 'Burundian Franc' },
    { code: 'BMD', name: 'Bermudian Dollar' },
    { code: 'BND', name: 'Brunei Dollar' },
    { code: 'BOB', name: 'Bolivian Boliviano' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'BSD', name: 'Bahamian Dollar' },
    { code: 'BTN', name: 'Bhutanese Ngultrum' },
    { code: 'BWP', name: 'Botswanan Pula' },
    { code: 'BYN', name: 'Belarusian Ruble' },
    { code: 'BZD', name: 'Belize Dollar' },
    { code: 'CDF', name: 'Congolese Franc' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CLP', name: 'Chilean Peso' },
    { code: 'COP', name: 'Colombian Peso' },
    { code: 'CRC', name: 'Costa Rican Colón' },
    { code: 'CUP', name: 'Cuban Peso' },
    { code: 'CZK', name: 'Czech Koruna' },
    { code: 'DJF', name: 'Djiboutian Franc' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'DOP', name: 'Dominican Peso' },
    { code: 'DZD', name: 'Algerian Dinar' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'ERN', name: 'Eritrean Nakfa' },
    { code: 'ETB', name: 'Ethiopian Birr' },
    { code: 'FJD', name: 'Fijian Dollar' },
    { code: 'FKP', name: 'Falkland Islands Pound' },
    { code: 'GEL', name: 'Georgian Lari' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'GIP', name: 'Gibraltar Pound' },
    { code: 'GMD', name: 'Gambian Dalasi' },
    { code: 'GNF', name: 'Guinean Franc' },
    { code: 'GTQ', name: 'Guatemalan Quetzal' },
    { code: 'GYD', name: 'Guyanese Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'HNL', name: 'Honduran Lempira' },
    { code: 'HRK', name: 'Croatian Kuna' },
    { code: 'HTG', name: 'Haitian Gourde' },
    { code: 'HUF', name: 'Hungarian Forint' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'ILS', name: 'Israeli New Shekel' },
    { code: 'IQD', name: 'Iraqi Dinar' },
    { code: 'IRR', name: 'Iranian Rial' },
    { code: 'ISK', name: 'Icelandic Króna' },
    { code: 'JMD', name: 'Jamaican Dollar' },
    { code: 'JOD', name: 'Jordanian Dinar' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'KGS', name: 'Kyrgystani Som' },
    { code: 'KHR', name: 'Cambodian Riel' },
    { code: 'KMF', name: 'Comorian Franc' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },
    { code: 'KYD', name: 'Cayman Islands Dollar' },
    { code: 'KZT', name: 'Kazakhstani Tenge' },
    { code: 'LAK', name: 'Laotian Kip' },
    { code: 'LBP', name: 'Lebanese Pound' },
    { code: 'LKR', name: 'Sri Lankan Rupee' },
    { code: 'LRD', name: 'Liberian Dollar' },
    { code: 'LSL', name: 'Lesotho Loti' },
    { code: 'LYD', name: 'Libyan Dinar' },
    { code: 'MAD', name: 'Moroccan Dirham' },
    { code: 'MDL', name: 'Moldovan Leu' },
    { code: 'MGA', name: 'Malagasy Ariary' },
    { code: 'MKD', name: 'Macedonian Denar' },
    { code: 'MMK', name: 'Myanma Kyat' },
    { code: 'MNT', name: 'Mongolian Tugrik' },
    { code: 'MOP', name: 'Macanese Pataca' },
    { code: 'MRU', name: 'Mauritanian Ouguiya' },
    { code: 'MUR', name: 'Mauritian Rupee' },
    { code: 'MVR', name: 'Maldivian Rufiyaa' },
    { code: 'MWK', name: 'Malawian Kwacha' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'MZN', name: 'Mozambican Metical' },
    { code: 'NAD', name: 'Namibian Dollar' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'NIO', name: 'Nicaraguan Córdoba' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'NPR', name: 'Nepalese Rupee' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'OMR', name: 'Omani Rial' },
    { code: 'PAB', name: 'Panamanian Balboa' },
    { code: 'PEN', name: 'Peruvian Nuevo Sol' },
    { code: 'PGK', name: 'Papua New Guinean Kina' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'PLN', name: 'Polish Złoty' },
    { code: 'PYG', name: 'Paraguayan Guarani' },
    { code: 'QAR', name: 'Qatari Rial' },
    { code: 'RON', name: 'Romanian Leu' },
    { code: 'RSD', name: 'Serbian Dinar' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'RWF', name: 'Rwandan Franc' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'SBD', name: 'Solomon Islands Dollar' },
    { code: 'SCR', name: 'Seychellois Rupee' },
    { code: 'SDG', name: 'Sudanese Pound' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'SHP', name: 'Saint Helena Pound' },
    { code: 'SLL', name: 'Sierra Leonean Leone' },
    { code: 'SOS', name: 'Somali Shilling' },
    { code: 'SRD', name: 'Surinamese Dollar' },
    { code: 'STN', name: 'São Tomé and Príncipe Dobra' },
    { code: 'SYP', name: 'Syrian Pound' },
    { code: 'SZL', name: 'Swazi Lilangeni' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'TJS', name: 'Tajikistani Somoni' },
    { code: 'TMT', name: 'Turkmenistani Manat' },
    { code: 'TND', name: 'Tunisian Dinar' },
    { code: 'TOP', name: 'Tongan Paʻanga' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'TTD', name: 'Trinidad and Tobago Dollar' },
    { code: 'TWD', name: 'New Taiwan Dollar' },
    { code: 'TZS', name: 'Tanzanian Shilling' },
    { code: 'UAH', name: 'Ukrainian Hryvnia' },
    { code: 'UGX', name: 'Ugandan Shilling' },
    { code: 'UYU', name: 'Uruguayan Peso' },
    { code: 'UZS', name: 'Uzbekistani Som' },
    { code: 'VES', name: 'Venezuelan Bolívar' },
    { code: 'VND', name: 'Vietnamese Đồng' },
    { code: 'VUV', name: 'Vanuatu Vatu' },
    { code: 'WST', name: 'Samoan Tala' },
    { code: 'XAF', name: 'Central African CFA Franc' },
    { code: 'XCD', name: 'East Caribbean Dollar' },
    { code: 'XOF', name: 'West African CFA Franc' },
    { code: 'XPF', name: 'CFP Franc' },
    { code: 'YER', name: 'Yemeni Rial' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'ZMW', name: 'Zambian Kwacha' },
    { code: 'ZWL', name: 'Zimbabwean Dollar' },

  ]
  // // Search term for filtering
  // searchTerm = '';
  // // Toggle to show or hide the dropdown
  // dropdownOpen = false;


  @Input() isVisible = false;
  @Output() visibilityChange = new EventEmitter<boolean>();


  constructor(private fb: FormBuilder, private apiServiceService: ApiServiceService) { }

  getSourceDestinationCombine() {
    forkJoin({
      source: this.apiServiceService.getCompanyList('/api/source/'),
      destination: this.apiServiceService.getCompanyList('/api/destination/')
    }).subscribe(({ source, destination }) => {
      // Assign the API responses to their respective lists
      this.sourceList = source;
      this.destinationList = destination;

      // Combine the data from sourceList and destinationList into sourceDestinationTransshipment
      this.sourceDestinationVia = [...this.sourceList, ...this.destinationList];
      // console.log(this.sourceDestinationTransshipment);
    });
  }

  ngOnInit() {
    this.getCurrentDateFormatted()
    this.getCompanyList()
    this.getSource()
    this.getDestination()
    this.getSourceDestinationCombine()

    // DATE FORMATING 
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    this.todayDate = yyyy + '-' + mm + '-' + dd;

    //  FORM  

    this.formData = this.fb.group({
      companyName: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      cargotype: ['', Validators.required],
      transitTime: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      freightType: ['', Validators.required],
      rate: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      currency: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      rateType: [''],
      free_days: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      isDirectShipment: [false],
      transhipment_add_port: [{ value: '', disabled: this.isDirectShipment }],
      hazValue: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^(?!0000)\d{4}$/)]],
      remarks: [''],
      hazActiveStatus: [false],
      free_days_comment: [''],
      terms_condition: [''],
    });

    this.getEquipments();
    this.apiServiceService.getCompanyList('/api/companies/').subscribe((data: any[]) => {
      this.companyList = data;
    });

    // Subscribe to changes in hazActiveStatus
    this.formData.get('hazActiveStatus')?.valueChanges.subscribe(status => {
      if (status) {
        this.formData.get('hazValue')?.enable();
      } else {
        this.formData.get('hazValue')?.disable();
      }
    });
  }

  // Method to filter currencies based on search term
  // get filteredCurrencies() {
  //   return this.currencyLists.filter(currency =>
  //     currency.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //     currency.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }


   // Handles input event and filters currency
   onCurrencyInput(event: any) {
    this.currencyInputValue = event.target.value;
    if (this.currencyInputValue.length >= 1) {
      this.filteredCurrencies = this.filterCurrency(this.currencyInputValue);
    } else {
      this.filteredCurrencies = [];
    }
    this.showCurrencyDropdown = true;
  }

  // Handles the selection of a currency
  selectCurrency(currencyCode: string) {
    this.formData.get('currency')?.setValue(currencyCode);
    this.currencyInputValue = currencyCode; // Update the input with the selected value
    this.showCurrencyDropdown = false;
  }
  // Filtering logic
  filterCurrency(query: string) {
    return this.currencyLists.filter((currency: any) =>
      currency.name.toLowerCase().includes(query.toLowerCase()) ||
      currency.code.toLowerCase().includes(query.toLowerCase())
    );
  }

  hideCurrencyDropdown() {
    setTimeout(() => {
      this.showCurrencyDropdown = false;
      // Clear input if no valid currency is selected
      if (!this.currencyLists.some(currency => currency.code === this.currencyInputValue)) {
        this.formData.get('currency')?.setValue('');
        this.currencyInputValue = ''; // Clear input if the user hasn't selected a valid currency
      }
    }, 250);// Delay to allow click event to register before hiding
  }

  // // Toggle the dropdown
  // toggleDropdown() {
  //   this.dropdownOpen = !this.dropdownOpen;
  // }
  // // Close dropdown when selecting a currency
  // closeDropdown() {
  //   this.dropdownOpen = false;
  //   this.searchTerm = ''; // Clear the search term after selection
  // }

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
  getCompanyList() {
    this.apiServiceService.getCompanyList('/api/companies/').subscribe(res => {
      this.companyList = res
    })
  }
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

  // getSourceDestinationCombine() {
  //   this.sourceDestinationTransshipment = [...this.sourceList, ...this.destinationList]
  //   console.log(this.sourceDestinationTransshipment)
  // }

  // Toggle radio button value
  onHazCheckboxStatusChange(event: any) {
    // // this.hazType = event.target.checked;
    // this.hazActiveStatus = event.target.checked;
    // if (this.hazActiveStatus) {
    //   this.formData.get('hazValue')?.enable();
    // } else {
    //   this.formData.get('hazValue')?.disable();
    // }
    this.formData.get('hazActiveStatus')?.setValue(event.target.checked);
    if (event.target.checked) {
      this.hazActiveStatus = true
    } else {
      this.hazActiveStatus = false
    }

  }

  ListDatabyId(event: any) {
    // console.log(event);
    this.isLoading = true;
    const selectedIndex = event.target.selectedIndex;
    const selectedOption = event.target.options[selectedIndex];
    const selectedOptionName = selectedOption.textContent || selectedOption.innerText;
    this.manualFilterChooseFromShippingLine = selectedOptionName

    // console.log('Selected option name:', selectedOptionName);

    this.companyID = event.target.value
    //  console.log(this.companyID);

    if (selectedOptionName == 'Cosco') {
      this.dataShitForamat = 'application/pdf'
      this.fileTypesChooseName = 'Pdf'
    } else if (selectedOptionName == 'Interasia') {
      this.dataShitForamat = '.docx,.doc'
      this.fileTypesChooseName = 'Doc'
    } else if (selectedOptionName == 'Emirates') {
      this.dataShitForamat = '.xlsx'
      this.fileTypesChooseName = 'Excel'
    }

    this.getcurrentDataList()
    this.getManualRateData()

  }
  getcurrentDataList() {
    this.apiServiceService.complanyListDataById('/api/company-rates/', this.companyID).subscribe(res => {
      this.currentcompanyListData = res
      this.isLoading = false;

      console.log(this.currentcompanyListData)
      // console.log(res, "refresh ssuceessfully");


    })
  }

  onFileSelected(event: any) {

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.snipperDialoug = true
      this.selectedFile = inputElement.files[0];
      this.selectedFileType = this.selectedFile.type;
      // console.log(">>>>",this.selectedFileType);
      // console.log(this.selectedFileType);
      const formData = new FormData();
      const fileInput = document.getElementById('input-file') as HTMLInputElement;

      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        formData.append('file', file, file.name);
        formData.append('company_id', this.companyID);

        if (this.selectedFileType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.apiServiceService.submitFileData('/api/import-excel/', formData).subscribe(res => {
            console.log(" excel successfully Updated");

            this.getcurrentDataList()
            this.snipperDialoug = false
          }),
            (error: any) => {
              console.log(error);

            }

        } else if (this.selectedFileType == 'application/pdf') {
          this.apiServiceService.submitFileData('/api/extract-pdf-table/', formData).subscribe(res => {
            console.log(res)
            console.log(" pdf successfully Updated");

            this.getcurrentDataList()
            this.snipperDialoug = false

          }),
            (error: any) => {
              console.log(error);

            }

        } else if (this.selectedFileType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          this.apiServiceService.submitFileData('/api/extract-word-table/', formData).subscribe(res => {
            console.log(" word successfully Updated");
            this.getcurrentDataList()
            this.snipperDialoug = false

          }),
            (error: any) => {
              console.log(error);

            }

        }



      }
    }

  }

  handleEditVisibilityChange(isEditVisible: boolean) {
    this.isEditModalVisible = isEditVisible;
  }

  handleCloneVisibilityChange(isCloneVisible: boolean) {
    this.isCloneModalVisible = isCloneVisible;
  }


  getManualRateData() {
    this.apiServiceService.getCompanyList('/api/manual-rate/').subscribe(res => {
      this.manualRateLists = res;
      this.isLoading = false;
      console.log(res)
      // this.companyList.push({ name: this.companyList });
    })
  }

  // EDIT MODAL OPEN HERE
  openManualEditModal(data: any) {
    // this.isEditData.emit(data)
    this.isEditData = data
    this.isEditModalVisible = true;
  }

  openManualCloneModal(data: any) {
    // this.isCloneData.emit(data)
    this.isCloneData = data
    this.isCloneModalVisible = true;
  }

  selectedTab: string = 'MANUAL RATE'; // Default selected tab
  selectTab(tab: string): void {
    this.selectedTab = tab;
  }


  // onInput(event: any): void {
  //   const value = event.target.value.toLowerCase();
  //   this.filteredCompanies = this.companyList.filter((company: any) =>
  //     company.name.toLowerCase().includes(value)
  //   );
  // }

  // ******************************** COMPANY FUNCTIONALITY ***********************************
  // Example onInput method to filter companies
  onInput(event: any) {
    this.inputValue = event.target.value;

    // Perform filtering based on the input value
    if (this.inputValue.length >= 2) {
      // Example of filtering logic: Update the filteredCompanies array based on input
      this.filteredCompanies = this.filterCompanies(this.inputValue);
    } else {
      // If input length is less than 2, do not show filtered results
      this.filteredCompanies = [];
    }
  }

  // Example filtering method (replace with your actual logic)
  filterCompanies(query: string) {
    // Example filter logic
    return this.companyList.filter((company: any) =>
      company.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  selectCompany(name: string) {
    this.formData.get('companyName')!.setValue(name);
    this.showDropdown = false;
  }

  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 100); // Delay to allow click event to register before hiding
  }

  // ******************************** SOURCE FUNCTIONALITY ***********************************
  onSourceInput(event: any): void {
    // const value = event.target.value.toLowerCase();
    // console.log(value)
    // this.filteredSources = this.sourceList.filter((source: any) =>
    //   source.name.toLowerCase().includes(value)
    // );

    this.sourceInputValue = event.target.value;

    // Perform filtering based on the input value
    if (this.sourceInputValue.length >= 2) {
      // Example of filtering logic: Update the filteredCompanies array based on input
      this.filteredSources = this.filterSources(this.sourceInputValue);
    } else {
      // If input length is less than 2, do not show filtered results
      this.filteredSources = [];
    }
  }

  filterSources(query: string) {
    return this.sourceList.filter((source: any) =>
      source.name.toLowerCase().includes(query.toLowerCase())
    );

  }

  selectSource(name: string) {
    this.formData.get('source')!.setValue(name);
    this.showSourceDropdown = false;
  }
  hideSourceDropdown() {
    setTimeout(() => {
      this.showSourceDropdown = false;
    }, 100); // Delay to allow click event to register before hiding
  }

  // ********************************* DESTINATION FUNCTIONALITY ********************************************
  onDestinationInput(event: any): void {
    // const value = event.target.value.toLowerCase();
    // this.filteredDestination = this.destinationList.filter((dest: any) =>
    //   dest.name.toLowerCase().includes(value)
    // );
    // // this.checkCompanyMatch(value);
    this.destinationInputValue = event.target.value;

    // Perform filtering based on the input value
    if (this.destinationInputValue.length >= 2) {
      // Example of filtering logic: Update the filteredCompanies array based on input
      this.filteredDestination = this.filterDestination(this.destinationInputValue);
    } else {
      // If input length is less than 2, do not show filtered results
      this.filteredDestination = [];
    }
  }
  filterDestination(query: any) {
    return this.destinationList.filter((destination: any) =>
      destination.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  selectDestination(name: string) {
    this.formData.get('destination')!.setValue(name);
    this.showDestinationDropdown = false;
  }
  hideDestinationDropdown() {
    setTimeout(() => {
      this.showDestinationDropdown = false;
    }, 100); // Delay to allow click event to register before hiding
  }


  getEquipments() {
    this.apiServiceService.getCompanyList('/api/frighttype/').subscribe(res => {

      this.equipmentsList = res

    })
  }

  onSubmitHandler(): void {
    // const transhipmentControl = this.formData.get('transhipment_add_port');
    // if (this.isDirectShipment && transhipmentControl?.disabled) {
    //   transhipmentControl.enable();
    // }
    const modifiedData = {
      company: this.formData.value.companyName,
      source: this.formData.value.source,
      destination: this.formData.value.destination,
      cargotype: this.formData.value.cargotype,
      transit_time: this.formData.value.transitTime,
      freight_type: this.formData.value.freightType,
      direct_shipment: this.isDirectShipment,
      spot_filed: this.formData.value.rateType,
      rate: this.formData.value.rate,
      free_days: this.formData.value.free_days,
      free_days_comment: this.formData.value.free_days_comment,
      currency: this.formData.value.currency,
      hazardous: this.formData.value.hazActiveStatus,
      un_number: this.formData.value.hazValue,
      terms_condition: this.formData.value.terms_condition,
      transhipment_add_port: this.formData.value?.transhipment_add_port || '',
      effective_date: this.formData.value.effectiveDate,
      expiration_date: this.formData.value.expirationDate,
      remarks: this.formData.value.remarks,
    }
    // console.log(modifiedData)
    if (this.formData.valid) {
      this.apiServiceService.addManualRate('/api/manual-rate/', modifiedData).subscribe(response => {
        if (response.message === 'already exists') {
          this.serverResposeMessage = 'This Rate is already exists'
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
          title: `${this.formData.value.companyName.toUpperCase()} Added Successfully`
        });
        this.formData.reset();
        this.isDirectShipment = false
        this.rateType = 'spot'
        this.getCompanyList()
        this.getManualRateData()
      })
    } else {
      // Mark all controls as touched to trigger validation errors
      this.formData.markAllAsTouched();
    }
  }

  onDirectShipmentChange(event: any): void {
    this.isDirectShipment = event.target.checked;
    if (this.isDirectShipment) {
      this.formData.get('transhipment_add_port')?.disable();
    } else {
      this.formData.get('transhipment_add_port')?.enable();
    }
  }

  openDeleteModal(id: string) {
    this.selectedId = id
    // alert(id)
  }
  deleteModalConfirmation() {
    if (this.selectedId) {
      this.apiServiceService.deleteManualRate(`/api/manual-rate/delete/${this.selectedId}/`).subscribe(response => {
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
          title: `Deleted Successfully`
        });
        this.getCompanyList()
      })
    }
    else {
      console.log('Form is not valid');
    }
  }

  toggleRateType(event: any): void {
    this.isRateTypeStatus = event.target.checked;
  }

}
