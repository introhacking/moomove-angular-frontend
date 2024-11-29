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
  templateCompanyList: any = []
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
  templateFilterChooseFromShippingLine: string = '';
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

  isRateTypeStatus: boolean = false
  rateType: string = 'filed';
  hazActiveStatus: boolean = false;

  serverResposeMessage: any = ''

  sourceDestinationVia: any[] = []

  // DATE FORMATING VARIABLE
  // todayDate: any

  todayDate: string = new Date().toISOString().split('T')[0]; // Current date for validFrom
  minExpirationDate: string = ''; // Dynamic min expiration date

  showCurrencyDropdown: boolean = false;
  filteredCurrencies: any[] = [];
  currencyInputValue: string = '';

  // Via(Combine source and destionation)
  selectedVia: string[] = [];
  showViaDropdown: boolean = false;
  filteredVia: any[] = [];
  viaInputValue: string = '';


  // Haz Class
  showHazClassDropdown: boolean = false;
  filteredHazClass: any[] = [];
  hazClassInputValue: string = '';


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

  packingGp = [
    { pckgp: 'I' },
    { pckgp: 'II' },
    { pckgp: 'III' },
    { pckgp: 'IV' },
    { pckgp: 'V' },
    { pckgp: 'VI' },
    { pckgp: 'VII' },
    { pckgp: 'VIII' },
    { pckgp: 'IX' },
  ]

  hazClassValue = [
    { hazClass: '0.1' },
    { hazClass: '0.2' },
    { hazClass: '0.3' },
    { hazClass: '0.4' },
    { hazClass: '0.5' },
    { hazClass: '0.6' },
    { hazClass: '0.7' },
    { hazClass: '0.8' },
    { hazClass: '0.9' },
    { hazClass: '1.0' },
    { hazClass: '1.1' },
    { hazClass: '1.2' },
    { hazClass: '1.3' },
    { hazClass: '1.4' },
    { hazClass: '1.5' },
    { hazClass: '1.6' },
    { hazClass: '1.7' },
    { hazClass: '1.8' },
    { hazClass: '1.9' },
    { hazClass: '2.0' },
    { hazClass: '2.1' },
    { hazClass: '2.2' },
    { hazClass: '2.3' },
    { hazClass: '2.4' },
    { hazClass: '2.5' },
    { hazClass: '2.6' },
    { hazClass: '2.7' },
    { hazClass: '2.8' },
    { hazClass: '2.9' },
    { hazClass: '3.0' },
    { hazClass: '3.1' },
    { hazClass: '3.2' },
    { hazClass: '3.3' },
    { hazClass: '3.4' },
    { hazClass: '3.5' },
    { hazClass: '3.6' },
    { hazClass: '3.7' },
    { hazClass: '3.8' },
    { hazClass: '3.9' },
    { hazClass: '4.0' },
    { hazClass: '4.1' },
    { hazClass: '4.2' },
    { hazClass: '4.3' },
    { hazClass: '4.4' },
    { hazClass: '4.5' },
    { hazClass: '4.6' },
    { hazClass: '4.7' },
    { hazClass: '4.8' },
    { hazClass: '4.9' },
    { hazClass: '5.0' },
    { hazClass: '5.1' },
    { hazClass: '5.2' },
    { hazClass: '5.3' },
    { hazClass: '5.4' },
    { hazClass: '5.5' },
    { hazClass: '5.6' },
    { hazClass: '5.7' },
    { hazClass: '5.8' },
    { hazClass: '5.9' },
    { hazClass: '6.0' },
    { hazClass: '6.1' },
    { hazClass: '6.2' },
    { hazClass: '6.3' },
    { hazClass: '6.4' },
    { hazClass: '6.5' },
    { hazClass: '6.6' },
    { hazClass: '6.7' },
    { hazClass: '6.8' },
    { hazClass: '6.9' },
    { hazClass: '7.0' },
    { hazClass: '7.1' },
    { hazClass: '7.2' },
    { hazClass: '7.3' },
    { hazClass: '7.4' },
    { hazClass: '7.5' },
    { hazClass: '7.6' },
    { hazClass: '7.7' },
    { hazClass: '7.8' },
    { hazClass: '7.9' },
    { hazClass: '8.0' },
    { hazClass: '8.1' },
    { hazClass: '8.2' },
    { hazClass: '8.3' },
    { hazClass: '8.4' },
    { hazClass: '8.5' },
    { hazClass: '8.6' },
    { hazClass: '8.7' },
    { hazClass: '8.8' },
    { hazClass: '8.9' },
    { hazClass: '9.0' },
    { hazClass: '9.1' },
    { hazClass: '9.2' },
    { hazClass: '9.3' },
    { hazClass: '9.4' },
    { hazClass: '9.5' },
    { hazClass: '9.6' },
    { hazClass: '9.7' },
    { hazClass: '9.8' },
    { hazClass: '9.9' }
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
    this.getCompanyListTemplate()
    this.getSource()
    this.getDestination()
    this.getSourceDestinationCombine()
    // DATE FORMATING 
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();
    // this.todayDate = yyyy + '-' + mm + '-' + dd;

    //  FORM  

    this.formData = this.fb.group({
      companyName: ['', Validators.required],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      cargotype: [{ value: '', disabled: false }, Validators.required],
      transitTime: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      freightType: ['', Validators.required],
      rate: ['', [Validators.required, Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")]],
      currency: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expirationDate: [{ value: '', disabled: this.isRateTypeStatus }, Validators.required],
      isRateTypeStatus: [false],
      vessel_name: [{ value: '', disabled: !this.isRateTypeStatus }, Validators.required],
      voyage: [{ value: '', disabled: !this.isRateTypeStatus }, Validators.pattern(/^[a-zA-Z0-9]{3,10}$/)],
      haz_class: [{ value: '', disabled: true }, Validators.required],
      packing_group: [{ value: '', disabled: true }, Validators.required],
      rateType: [this.rateType],
      free_days: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      isDirectShipment: [false],
      transhipment_add_port: [{ value: '', disabled: this.isDirectShipment }, Validators.required],
      hazValue: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^(?!0000)\d{4}$/)]],
      hazActiveStatus: [false],
      free_days_comment: [''],
      remarks: [''],
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
        this.formData.get('haz_class')?.enable();
        this.formData.get('packing_group')?.enable();
        this.formData.get('cargotype')?.disable();
      } else {
        this.formData.get('hazValue')?.disable();
        this.formData.get('haz_class')?.disable();
        this.formData.get('packing_group')?.disable();
        this.formData.get('cargotype')?.enable();
      }
    });

    this.formData.get('rateType')?.setValue(this.rateType);
  }


  // Update the minimum expiration date based on the selected validFrom date
  onValidFromChange() {
    const validFromDate = this.formData.get('effectiveDate')?.value;

    if (validFromDate) {
      // Update the minimum expiration date to the selected validFrom date
      this.minExpirationDate = validFromDate;

      // Check if the current expiration date is earlier than the new validFrom date
      const expirationDate = this.formData.get('expirationDate')?.value;
      if (expirationDate && expirationDate < validFromDate) {
        // If expiration date is earlier, clear the expiration date
        this.formData.get('expirationDate')?.setValue('');
      }
    }
  }

  // Handle when expiration date is changed
  onExpirationDateChange() {
    const validFromDate = this.formData.get('effectiveDate')?.value;
    const expirationDate = this.formData.get('expirationDate')?.value;

    // Ensure the expiration date is not earlier than the validFrom date
    if (validFromDate && expirationDate < validFromDate) {
      this.formData.get('expirationDate')?.setErrors({ invalidDate: true });
    } else {
      this.formData.get('expirationDate')?.setErrors(null);
    }
  }

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


  // Handles input event and filters currency
  onViaInput(event: any) {
    const input = event.target.value;
    this.viaInputValue = input;
    this.filteredVia = this.filterVia(input);  // Filter the list based on input
    this.showViaDropdown = true;  // Show the dropdown while typing
  }

  // Handles the selection of a currency
  selectVia(viaName: string) {
    // this.formData.get('transhipment_add_port')!.setValue(viaName);
    // this.viaInputValue = viaName; // Update the input with the selected value
    // this.showViaDropdown = false;

    ///////////////////////////////////////////////////////////////////////////////
    // Add the selected option to the selectedVia array
    if (!this.selectedVia.includes(viaName)) {
      this.selectedVia.push(viaName);
    }

    // Clear the input field after selection
    this.viaInputValue = '';
    this.showViaDropdown = false;  // Hide the dropdown after selection
    this.updateFormControl();  // Update the form control with the selected values
  }

  // Check if an item is already selected
  isSelected(viaName: string): boolean {
    return this.selectedVia.includes(viaName);
  }

  updateFormControl() {
    // Update the form control with the selected values (as a comma-separated string or array)
    // this.formData.get('transhipment_add_port')!.setValue(this.selectedVia.join(', '));
    this.formData.get('transhipment_add_port')!.setValue(this.selectedVia.join(', '));
    this.viaInputValue = '';
  }

  // Method to add new via when it's not found in the list
  addNewVia(via: string) {
    if (!this.selectedVia.includes(via) && via !== '') {
      this.selectedVia.push(via);
      this.formData.controls['transhipment_add_port'].setValue('');
      this.viaInputValue = '';
    }
    this.formData.controls['transhipment_add_port']!.setValue(this.selectedVia.join(', '));
    this.filteredVia = [];
    this.showViaDropdown = false;
  }

  // Remove an option from the selected list
  removeVia(via: string) {
    const index = this.selectedVia.indexOf(via);
    if (index > -1) {
      this.selectedVia.splice(index, 1);  // Remove the item from selectedVia array
      this.updateFormControl();  // Update the form control after removal
    }
  }

  // Filtering logic
  filterVia(query: string) {
    return this.sourceDestinationVia.filter((transhipmentPort: any) =>
      transhipmentPort.name.toLowerCase().includes(query.toLowerCase())
      // ||
      //   transhipmentPort.code.toLowerCase().includes(query.toLowerCase())
    );
  }

  hideViaDropdown() {
    setTimeout(() => {
      this.showViaDropdown = false;
    }, 200); // Delay to ensure selection is registered

  }

  // Handles input event and filters currency
  onHazClassInput(event: any) {
    this.hazClassInputValue = event.target.value;
    if (this.hazClassInputValue.length >= 1) {
      this.filteredHazClass = this.filterHazClass(this.hazClassInputValue);
    } else {
      this.filteredHazClass = [];
    }
    this.showHazClassDropdown = true;
  }

  // Handles the selection of a currency
  selectHazClass(hazValue: string) {
    this.formData.get('haz_class')!.setValue(hazValue);
    this.hazClassInputValue = hazValue; // Update the input with the selected value
    this.showHazClassDropdown = false;
  }
  // Filtering logic
  filterHazClass(query: string) {
    return this.hazClassValue.filter((hazClass: any) =>
      hazClass.hazClass.toLowerCase().includes(query.toLowerCase())
      // ||
      //   hazClass.code.toLowerCase().includes(query.toLowerCase())
    );
  }

  hideHazClassDropdown() {
    setTimeout(() => {
      this.showHazClassDropdown = false;
      // Clear input if no valid hazClass is selected
      if (!this.hazClassValue.some(hazClass => hazClass.hazClass === this.hazClassInputValue)) {
        this.formData.get('haz_class')!.setValue('');
        this.hazClassInputValue = ''; // Clear input if the user hasn't selected a valid currency
        this.showHazClassDropdown = false;
      }
    }, 250);// Delay to allow click event to register before hiding
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
  getCompanyList() {
    this.apiServiceService.getCompanyList('/api/companies/').subscribe(res => {
      this.companyList = res
    })
  }
  getCompanyListTemplate() {
    this.apiServiceService.getCompanyList('/api/client-template/').subscribe(res => {
      this.templateCompanyList = res
      console.log(res)
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

  // Toggle radio button value
  onHazCheckboxStatusChange(event: any) {
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
    this.templateFilterChooseFromShippingLine = selectedOptionName

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
  }
  ManualViewListDataById(event: any) {
    this.isLoading = true;
    const selectedIndex = event.target.selectedIndex;
    const selectedManualOption = event.target.options[selectedIndex];
    const selectedOptionManualName = selectedManualOption.textContent || selectedManualOption.innerText;
    this.manualFilterChooseFromShippingLine = selectedOptionManualName

    // GET COMPANY ID 
    this.companyID = event.target.value
    this.getManualRateData()
  }


  getcurrentDataList() {
    this.apiServiceService.complanyListDataById('/api/company-rates/', this.companyID).subscribe(res => {
      this.currentcompanyListData = res
      this.isLoading = false;
      console.log(res)
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
    this.apiServiceService.complanyListDataById('/api/manual-rate/', this.companyID).subscribe(res => {
      this.manualRateLists = res;
      this.isLoading = false;
      // console.log(res)
      // this.companyList.push({ name: this.companyList });
    })
    // this.apiServiceService.getCompanyList('/api/manual-rate/').subscribe(res => {
    //   this.manualRateLists = res;
    //   this.isLoading = false;
    //   console.log(res)
    //   // this.companyList.push({ name: this.companyList });
    // })
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

  // ******************************** COMPANY FUNCTIONALITY ***********************************
  // Example onInput method to filter companies
  onInput(event: any) {
    this.inputValue = event.target.value;

    // Perform filtering based on the input value
    if (this.inputValue.length >= 1) {
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
    this.sourceInputValue = event.target.value;

    // Perform filtering based on the input value
    if (this.sourceInputValue.length >= 1) {
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
    if (this.destinationInputValue.length >= 1) {
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
    const cargotypeValue = this.formData.get('cargotype')?.value || null; // Provide default value if needed
    const modifiedData = {
      company: this.formData.value.companyName,
      source: this.formData.value.source,
      destination: this.formData.value.destination,
      cargotype: cargotypeValue || '',
      transit_time: this.formData.value.transitTime,
      freight_type: this.formData.value.freightType,
      direct_shipment: this.isDirectShipment,
      isRateTypeStatus: this.isRateTypeStatus,
      spot_filed: this.rateType,
      rate: this.formData.value.rate,
      free_days: this.formData.value.free_days,
      free_days_comment: this.formData.value.free_days_comment,
      currency: this.formData.value.currency,
      hazardous: this.formData.value.hazActiveStatus,
      un_number: this.formData.value.hazValue,
      vessel_name: this.formData.value.vessel_name,
      voyage: this.formData.value.voyage,
      haz_class: this.formData.value.haz_class,
      packing_group: this.formData.value.packing_group,
      terms_condition: this.formData.value.terms_condition,
      transhipment_add_port: this.formData.value?.transhipment_add_port || '',
      effective_date: this.formData.value.effectiveDate,
      expiration_date: this.formData.value.expirationDate,
      remarks: this.formData.value.remarks,
    }
    // console.log(modifiedData)
    if (this.formData.valid) {
      this.apiServiceService.addManualRate('/api/manual-rate/', modifiedData).subscribe(response => {
        const activity_log = localStorage.getItem('UserData');
        const parsedData = activity_log ? JSON.parse(activity_log) : {};
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
        this.rateType = 'filed'
        this.selectedVia = []
        // this.getCompanyList()
        // this.getManualRateData()
        this.refreshData()

        const log = {
          userId: parsedData.userId,
          action_type: 'Create Manual Rate',
          description: `Creating Manual Rate : ${modifiedData.company}`
        }

        this.apiServiceService.activityLogCreation('/api/activity-log/', log).subscribe((res) => {
          console.log(res)
        })

      })
    } else {
      // Mark all controls as touched to trigger validation errors
      this.formData.markAllAsTouched();
    }
  }

  // Method to refresh the data from API
  refreshData() {
    // Call your API to fetch updated data
    this.getManualRateData()
    this.getcurrentDataList()
    this.getCompanyList()
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
        // this.getCompanyList()
        this.refreshData()
      })
    }
    else {
      console.log('Form is not valid');
    }
  }

  onRateCheckboxStatusChange(event: any): void {
    this.isRateTypeStatus = event.target.checked;
    if (this.isRateTypeStatus) {
      this.formData.get('vessel_name')?.enable();
      this.formData.get('voyage')?.enable();
      this.formData.get('expirationDate')?.disable();
      this.rateType = 'spot'
    } else {
      this.formData.get('vessel_name')?.disable();
      this.formData.get('voyage')?.disable();
      this.formData.get('expirationDate')?.enable();
      this.rateType = 'filed'

    }
    this.formData.get('spot_filed')?.setValue(this.rateType);
  }

}
