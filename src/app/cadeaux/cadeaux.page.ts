import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from '../shared/services/entreprise.service';
import { CalendarComponentOptions, CalendarModal, CalendarModalOptions, CalendarResult } from 'ion2-calendar';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-cadeaux',
  templateUrl: './cadeaux.page.html',
  styleUrls: ['./cadeaux.page.scss'],
})
export class CadeauxPage implements OnInit {

  isDate=false;
  isModal=false;
  entreprise:any;
  clients:any=[];
  cadeaux:any=[];
  count:any;
  cadeau:any;

  private isCurrentView:boolean;
  private displayWarning:boolean;
  subscriptions: Subscription = new Subscription();


  constructor(
    private entrepriseService:EntrepriseService,
    public modalCtrl: ModalController,
    private router: Router,
    private platform: Platform,
  ) { 
    this.subscriptions.add(
      this.platform.backButton.subscribeWithPriority(9999, (processNextHandler)=>{
        if(this.isCurrentView){
          this.displayWarning=true;
        }else{
          processNextHandler();
        }
      })
    )
  }

  ngOnInit() {

    this.getEntreprise();
  }

  getEntreprise(){
    this.entrepriseService.getEntrepriseByUser().subscribe((res:any)=>{
      try {
        this.entreprise = res.body;
        if(this.entreprise){
          this.listDepenseByEntrepriseDuplic(this.entreprise._id);
          this.pointCountByEntreprise(this.entreprise._id); 
          this.listDepenseByEntreprise(this.entreprise._id);
        }

      } catch (error) {
        console.log("Erreur", error);
      }
    })
  }

  listDepenseByEntrepriseDuplic(idEntreprise){
    this.entrepriseService.listDepenseByEntrepriseDuplic(idEntreprise).subscribe((res:any)=>{
      try {
            console.log("Cadeaux duplic", res);
            this.clients = res.message;
      } catch (error) {
        console.log("Erreur",error);
      }
    })
  }

  listDepenseByEntreprise(idEntreprise){
    this.entrepriseService.listDepenseByEntreprise(idEntreprise).subscribe((res:any)=>{
      try {
            this.cadeaux = res.message;
            //console.log("Clients", this.clients);
      } catch (error) {
        console.log("Erreur",error);
      }
    })
  }

  pointCountByEntreprise(idEntreprise){
    this.entrepriseService.getCountDepenseByEntreprise(idEntreprise).subscribe((res:any)=>{
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
    this.entrepriseService.listDepenseByEntreprise(this.entreprise._id)
        .subscribe((res:any) => this.cadeaux = res.message.filter(client=>client.client.numeroClient.toLowerCase().includes(filterValue)));
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
  this.entrepriseService.listDepenseByEntreprise(this.entreprise._id)
  .subscribe((res:any) => this.cadeaux = res.message.filter(client=>new Date(client.creation) >= from && new Date(client.creation)<=to));
  console.log("From",from);
  console.log("TO",to);
  console.log("Client", this.cadeaux);

}


  clickModal(id){
    if(this.isModal){
      this.isModal=false
    }else{
      this.isModal=true
      this.getClientCadeau(id);
    }
  }

  getClientCadeau(id){
    this.entrepriseService.getClientByDepense(id).subscribe((res:any)=>{
      try {
           this.cadeau = res.message;
           console.log("Operation", this.cadeau);
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

  ionViewDidEnter(){
    this.isCurrentView=true;
  }
  ionViewWillLeave(){
    this.isCurrentView = false;
  }

}
