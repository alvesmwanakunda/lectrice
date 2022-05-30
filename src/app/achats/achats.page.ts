import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from '../shared/services/entreprise.service';
import { CalendarComponentOptions, CalendarModal, CalendarModalOptions, CalendarResult } from 'ion2-calendar';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';



@Component({
  selector: 'app-achats',
  templateUrl: './achats.page.html',
  styleUrls: ['./achats.page.scss'],
})
export class AchatsPage implements OnInit {

  isDate=false;
  isModal=false;
  entreprise:any;
  clients:any=[];
  count:any;
  achat:any;

  constructor(
    private entrepriseService:EntrepriseService,
    public modalCtrl: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.getEntreprise();
  }

  getEntreprise(){
    this.entrepriseService.getEntrepriseByUser().subscribe((res:any)=>{
      try {
        this.entreprise = res.body;
        if(this.entreprise){
          this.listClientByEntreprise(this.entreprise._id);
          this.pointCountByEntreprise(this.entreprise._id); 
        }

      } catch (error) {
        console.log("Erreur", error);
      }
    })
  }

  listClientByEntreprise(idEntreprise){
    this.entrepriseService.listOperationUserByAchat(idEntreprise).subscribe((res:any)=>{
      try {
            this.clients = res.message;
            console.log("Clients", this.clients);
      } catch (error) {
        console.log("Erreur",error);
      }
    })
  }

  pointCountByEntreprise(idEntreprise){
    this.entrepriseService.getCountAchatByEntreprise(idEntreprise).subscribe((res:any)=>{
      try {
            this.count = res.operation[0];
            console.log("Count point", this.count);
      } catch (error) {
        console.log("Erreur",error);
      }
    })
  }

  applyFilter(eveent:Event){

    const filterValue = (eveent.target as HTMLInputElement).value;
    console.log("Valeur", filterValue);
    this.entrepriseService.listOperationUserByAchat(this.entreprise._id)
        .subscribe((res:any) => this.clients = res.message.filter(client=>client.client.numeroClient.toLowerCase().includes(filterValue)));
  }

  async openCalendar() {
    const options: CalendarModalOptions={
      canBackwardsSelected: true,
      monthFormat: 'MMMM yyyy',
      //monthPickerFormat:"",
      weekdays: ['L','M','M','J','V','S','D'],
      pickMode:'range',
      title:'Rechercher',
      color:'primary',
      closeLabel:'Fermer',
      doneLabel:'Valider'
    };

    let myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps:{options}
    });
    myCalendar.present();
    const event:any = await myCalendar.onDidDismiss();
    const date: CalendarResult = event.data;
    if(date){
      this.applyFilterDate(date);
    }
    console.log(date);
}

applyFilterDate(data){

let from = new Date(data.from.string);
let to = new Date(data.to.string);
this.entrepriseService.listOperationUserByAchat(this.entreprise._id)
.subscribe((res:any) => this.clients = res.message.filter(client=>new Date(client.fin) >= from && new Date(client.fin)<=to));
console.log("From",from);
console.log("TO",to);
console.log("Client", this.clients);

}

clickModal(idOperation){
    if(this.isModal){
      this.isModal=false
    }else{
      this.isModal=true;
      this.getClientVisite(idOperation);
    }
}

getClientVisite(idOperation){
  this.entrepriseService.getClientByVisite(idOperation).subscribe((res:any)=>{
    try {
         this.achat = res.message;
         console.log("Operation", this.achat);
    } catch (error) {
      console.log("Erreur", error);
    }
  })
}

deconnect(){
  this.entrepriseService.updateConnexion().subscribe((res:any)=>{
    try {
        localStorage.removeItem("currentUser");
        localStorage.clear();
        this.router.navigate(["/"]);
    } catch (error) {
      console.log("Erreur",error);
    }
  })
}

}
