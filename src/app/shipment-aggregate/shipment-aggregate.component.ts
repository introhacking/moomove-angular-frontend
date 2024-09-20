import { Component } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shipment-aggregate',
  templateUrl: './shipment-aggregate.component.html',
  styleUrls: ['./shipment-aggregate.component.scss']
})
export class ShipmentAggregateComponent {
  source:any
  destination:any
  equipments:any
  shipment_Date:any
  currentDate:any
  shipdata:any=[]
 quantity:any
  constructor(public apiServiceService:ApiServiceService,public router:Router){}
  ngOnInit(){
    this.source=this.apiServiceService.source
    this.destination=this.apiServiceService.destination
    this.equipments=this.apiServiceService.equipments
    this.shipment_Date=this.apiServiceService.shipment_Date
    this.quantity=this.apiServiceService.quantity
    this.getCurrentDateFormatted();
    if(this.source){
     this.getshipmentData()
    }

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

  getshipmentData(){


    this.apiServiceService.getShipmentData(this.source,this.destination ,this.equipments).subscribe(res=>{
     console.log(">>",res);
     
      this.shipdata=res
      
      
    })
  }

  create_quote(id:any){
// console.log(id);
this.shipdata.map((ele:any)=>{
  if(ele.id==id){
    this.apiServiceService.quotation=ele
    console.log(ele);
    
  }

  
})


    this.router.navigateByUrl('quotation_page')

  }

}
