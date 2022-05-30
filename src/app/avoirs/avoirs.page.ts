import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from '../shared/services/entreprise.service';
import { CalendarComponentOptions, CalendarModal, CalendarModalOptions, CalendarResult } from 'ion2-calendar';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';



@Component({
  selector: 'app-avoirs',
  templateUrl: './avoirs.page.html',
  styleUrls: ['./avoirs.page.scss'],
})
export class AvoirsPage implements OnInit {

  isDate=false;
  isModal=false;
  entreprise:any;
  avoirs:any=[];
  count:any;
  countdepense:any;
  countencaisse:any;
  info:any;
  type:any;


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
            this.listAvoir(this.entreprise._id);
            this.countDepense(this.entreprise._id);
            this.countEncaisse(this.entreprise._id);
        }
      } catch (error) {
        console.log("Erreur", error);
      }
    })
  }

  listAvoir(idEntreprise){
    this.entrepriseService.listAvoirEntreprise(idEntreprise).subscribe((res:any)=>{
      try {
           this.avoirs = res.message;
           console.log("Avoirs", this.avoirs);
      } catch (error) {
         console.log("Erreur", error);
      }
    })
  }

  countDepense(idEntreprise){
    this.entrepriseService.countAvoirDepenseEntreprise(idEntreprise).subscribe((res:any)=>{
      try {
            console.log("Avoir depense", res);
            this.countdepense = res.depense[0];
      } catch (error) {
        console.log("Erreur", error);
      }
    }) 
  }

  countEncaisse(idEntreprise){
    this.entrepriseService.countAvoirEncaisseEntreprise(idEntreprise).subscribe((res:any)=>{
      try {
            console.log("Avoir encaisse", res);
            this.countencaisse = res.encaisse[0];
      } catch (error) {
        console.log("Erreur", error);
      }
    }) 
  }

  applyFilter(eveent:Event){

    const filterValue = (eveent.target as HTMLInputElement).value;
    console.log("Valeur", filterValue);
    this.entrepriseService.listAvoirEntreprise(this.entreprise._id)
        .subscribe((res:any) => this.avoirs = res.message.filter(avoir=>avoir.client.numeroClient.toLowerCase().includes(filterValue)));
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
  this.entrepriseService.listAvoirEntreprise(this.entreprise._id)
  .subscribe((res:any) => this.avoirs = res.message.filter(avoir=>new Date(avoir.creation) >= from && new Date(avoir.creation)<=to));
  console.log("From",from);
  console.log("TO",to);

}

  clickModal(id, type){
    if(this.isModal){
      this.isModal=false
    }else{
      this.isModal=true
      if(type=='Encaisse'){
          this.getClientEncaisse(id);
          this.type=type;
      }else{
        this.getClientDepense(id);
        this.type=type;
      }
    }
  }

  getClientDepense(id){
    this.entrepriseService.getClientByAvoirDepense(id).subscribe((res:any)=>{
      try {
           this.info = res.message;
           console.log("Operation", this.info);
      } catch (error) {
        console.log("Erreur", error);
      }
    })
  }

  getClientEncaisse(id){
    this.entrepriseService.getClientByAvoirEncaisse(id).subscribe((res:any)=>{
      try {
           this.info = res.message;
           console.log("Operation", this.info);
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
