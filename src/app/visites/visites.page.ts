import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from '../shared/services/entreprise.service';
import { CalendarComponentOptions, CalendarModal, CalendarModalOptions, CalendarResult } from 'ion2-calendar';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-visites',
  templateUrl: './visites.page.html',
  styleUrls: ['./visites.page.scss'],
})
export class VisitesPage implements OnInit {

  private isCurrentView:boolean;
  private displayWarning:boolean;
  subscriptions: Subscription = new Subscription();

  isDate=false;
  isModal=false;
  entreprise:any;
  clients:any=[];
  count:any;
  selected: Date | null;
  visite:any;
  
  constructor(
    private entrepriseService:EntrepriseService,
    public modalCtrl: ModalController,
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
          this.listClientByEntreprise(this.entreprise._id);
          this.pointCountByEntreprise(this.entreprise._id); 
        }

      } catch (error) {
        console.log("Erreur", error);
      }
    })
  }

  listClientByEntreprise(idEntreprise){
    this.entrepriseService.getClientByEntreprise(idEntreprise).subscribe((res:any)=>{
      try {
            this.clients = res.message.operations;
            console.log("Clients", this.clients);
      } catch (error) {
        console.log("Erreur",error);
      }
    })
  }

  pointCountByEntreprise(idEntreprise){
    this.entrepriseService.getCountPointByEntreprise(idEntreprise).subscribe((res:any)=>{
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
    this.entrepriseService.getClientByEntreprise(this.entreprise._id)
        .subscribe((res:any) => this.clients = res.message.operations.filter(client=>client.client.numeroClient.toLowerCase().includes(filterValue)));
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
   this.entrepriseService.getClientByEntreprise(this.entreprise._id)
   .subscribe((res:any) => this.clients = res.message.operations.filter(client=>new Date(client.fin) >= from && new Date(client.fin)<=to));
   console.log("From",from);
   console.log("TO",to);
   console.log("Client", this.clients);

 }



  clickModal(idOperation){
    if(this.isModal){
      this.isModal=false
    }else{
      this.isModal=true
      this.getClientVisite(idOperation);
    }
  }

  getClientVisite(idOperation){
    this.entrepriseService.getClientByVisite(idOperation).subscribe((res:any)=>{
      try {
           this.visite = res.message;
           console.log("Operation", this.visite);
      } catch (error) {
        console.log("Erreur", error);
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
