import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(data: any,value: any): any {

   
    if(!value){
      return data;
    }
    
    let searchValue=value.toLowerCase()

    return data.filter((item:any)=>{
      if(JSON.stringify(item).toLowerCase().includes(searchValue)){
        return item
      }
    })
  }

}
