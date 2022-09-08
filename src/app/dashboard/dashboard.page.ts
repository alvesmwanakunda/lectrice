import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from '../shared/services/entreprise.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
 } from '@angular/forms';
 import { LoadingController  } from '@ionic/angular';
 import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
//import { BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  user:any;
  entreprise:any;
  clientForm: FormGroup;
  achatForm: FormGroup;
  achatFormErrors:any;
  avoirForm: FormGroup;
  avoirFormErrors:any;
  clientFormErrors: any;
  submitted: boolean = false;
  client:any;
  clientAdd:any;
  scannedDate: {};
  encodedData='';
  QRSCANNED_DATA:string;
  isOn = false;
  isAchat = false;
  isAvoir = false;
  montant:any;
  code:any;
  test="6266c09bfcd08dd0264fcb63,625eb67e945ca3c559bdae86";
  panelOpenState = false;

  emailorphone = new FormControl("", [
    Validators.required,
  ]);

  private isCurrentView:boolean;
  private displayWarning:boolean;
  subscriptions: Subscription = new Subscription();

  

  constructor(
    private entrepriseService: EntrepriseService, 
    private loadingController: LoadingController,
    private qrScanner: BarcodeScanner,
    private router: Router,
    private platform: Platform,
    ) { 

    this.user = JSON.parse(localStorage.getItem("user"));
    this.clientFormErrors = {
      emailorphone: {},
      nom:{},
      prenom:{}
    };
    this.achatFormErrors = {
      montant:{}
    };
    this.avoirFormErrors = {
      montant:{}
    };
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

  account_validation_messages={
    emailorphone:[
      {
        type: "required",
        message: "Adresse email ou téléphone obligatoire",
      },{
        type:"pattern",
        message: "Identifiant incorrect. Veuillez reessayer.",
      }
    ],

    nom:[
      {
        type:"required",
        message:"Ce champ est requis"
      }
    ],
    prenom:[
      {
        type:"required",
        message:"Ce champ est requis"
      }
    ],

  };

  account_validation_achat={
    montant:[
      {
        type:"required",
        message:"Ce champ est requis"
      }
    ],
  };

  account_validation_avoir={
    montant:[
      {
        type:"required",
        message:"Ce champ est requis"
      }
    ],
  };

  onFormValuesChanged(){
    for (const field in this.clientFormErrors){
      if(!this.clientFormErrors.hasOwnProperty(field)){
        continue;
      }
      this.clientFormErrors[field]={};
      const control = this.clientForm.get(field);
      if(control && control.dirty && !control.valid){
        this.clientForm[field] = control.errors;
      }
    }
  }

  onFormValuesChangedAchat(){
    for (const field in this.achatFormErrors){
      if(!this.achatFormErrors.hasOwnProperty(field)){
        continue;
      }
      this.achatFormErrors[field]={};
      const control = this.achatForm.get(field);
      if(control && control.dirty && !control.valid){
        this.achatForm[field] = control.errors;
      }
    }
  }

  onFormValuesChangedAvoir(){
    for (const field in this.avoirFormErrors){
      if(!this.avoirFormErrors.hasOwnProperty(field)){
        continue;
      }
      this.avoirFormErrors[field]={};
      const control = this.avoirForm.get(field);
      if(control && control.dirty && !control.valid){
        this.avoirForm[field] = control.errors;
      }
    }
  }

  ngOnInit() {
    this.getEntreprise();
    this.clientForm = new FormGroup({
      emailorphone: new FormControl("",[
        Validators.required,
        Validators.pattern(
          "^((\\+\\d{1,3}(-| )?\\(?\\d\\)?(-| )?\\d{1,5})|(\\(?\\d{2,6}\\)?))(-| )?(\\d{3,4})(-| )?(\\d{4})(( x| ext)\\d{1,5}){0,1}$|(\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,6})+)"
        )
      ]),
      nom:new FormControl("",[Validators.required]),
      prenom:new FormControl("",[Validators.required]),
     
    });

    this.achatForm= new FormGroup({
      montant:new FormControl("",[Validators.required]),
    });

    this.avoirForm= new FormGroup({
      montant:new FormControl("",[Validators.required]),
    });
  }

  getEntreprise(){
    this.entrepriseService.getEntrepriseByUser().subscribe((res:any)=>{
      try {
        //console.log("Response", res);
        this.entreprise = res.body;
      } catch (error) {
        console.log("Erreur", error);
      }
    })
  }

  addClient():void{
    this.client = {};
      if(!this.clientForm.invalid){
        Object.assign(this.client, this.clientForm.value);
        this.entrepriseService.addClient(this.client, this.entreprise._id).subscribe((res:any)=>{

          if(!res.success){
               this.clientFormErrors["emailorphone"].found = true;
          }
          else{

            this.loadingPresent("ifOfLoading").then((res)=>{

              try {
                  //console.log("Response", res);
                  this.clientAdd = res;
                  this.loadingDismiss("ifOfLoading");
                  this.submitted = true;
              } catch (error) {
                this.loadingDismiss("ifOfLoading");
                console.log("Erreur ", error);
              }

            }).catch((err)=>{
              this.loadingDismiss("ifOfLoading");
            })
  
           
          }
  
        })
  
      }else{
        this.submitted = false
      }

  }

  addAchat():void{

    if(!this.achatForm.invalid){
      console.log("Value", this.achatForm.value);
        this.montant = this.achatForm.value;
        this.isAchat = false;
        this.scannerAchat(this.montant);
        if(this.montant){
          this.achatForm.setValue({montant:"0"});
        }
        
        //console.log("Montant", this.montant);
    }
  }

  addAvoir():void{

    if(!this.avoirForm.invalid){
        this.montant = this.avoirForm.value;
        this.isAvoir = false;
        this.scannerAvoir(this.montant)
        if(this.montant){
          this.avoirForm.setValue({montant:"0"});
        }
        //console.log("Montant", this.montant);
    }
  }

  async loadingPresent(loadingId: string) {

    const loading = await this.loadingController.create({
      id: loadingId,
      //message: "Veuillez patienter...",
      spinner: "circles"
    });
    return await loading.present();
  }

  async loadingDismiss(loadingId: string) {
    return await this.loadingController
      .dismiss(null, null, loadingId)
      .then((response) =>{
        console.log("loading dismissed alves", response)
      }).catch((err) => {
        console.log("Erreur", err);
      });
  }

  scannerVisite(){

    const options : BarcodeScannerOptions={
      preferFrontCamera:false,
      showFlipCameraButton:true,
      showTorchButton:false,
      torchOn:false,
      prompt:'Placer un code-barres à l\'intérieur de la zone de numérisation',
      resultDisplayDuration:100,
      orientation:'portrait'
    };

    this.qrScanner.scan(options).then(res=>{
      console.log('Scanned sommething', res);
       //this.QRSCANNED_DATA=res;
         this.entrepriseService.addOperationVisite(res.text, this.entreprise._id);
      }).catch((e:any)=> console.log('Error is', e.name));
  }
  
  scannerAchat(montant){

    const options : BarcodeScannerOptions={
      preferFrontCamera:false,
      showFlipCameraButton:true,
      showTorchButton:false,
      torchOn:false,
      prompt:'Placer un code-barres à l\'intérieur de la zone de numérisation',
      resultDisplayDuration:100,
      orientation:'portrait'
    };


    this.qrScanner.scan(options).then(res=>{
      console.log('Scanned sommething', res);
       //this.QRSCANNED_DATA=res;
         this.entrepriseService.addOperationAchat(res.text, this.entreprise._id,montant);
      }).catch((e:any)=> console.log('Error is', e.name));
  } 

  scannerAvoir(montant){

    const options : BarcodeScannerOptions={
      preferFrontCamera:false,
      showFlipCameraButton:true,
      showTorchButton:false,
      torchOn:false,
      prompt:'Placer un code-barres à l\'intérieur de la zone de numérisation',
      resultDisplayDuration:100,
      orientation:'portrait'
    };

    this.qrScanner.scan(options).then(res=>{
      console.log('Scanned sommething', res);
          this.entrepriseService.addOperationAvoir(res.text, this.entreprise._id,montant)
      }).catch((e:any)=> console.log('Error is', e.name));
  } 

  scannerCadeau(){

      
   const options : BarcodeScannerOptions={
      preferFrontCamera:false,
      showFlipCameraButton:true,
      showTorchButton:false,
      torchOn:false,
      prompt:'Placer un code-barres à l\'intérieur de la zone de numérisation',
      resultDisplayDuration:100,
      orientation:'portrait'
    };
    this.qrScanner.scan(options).then(res=>{
      console.log('Scanned sommething', res);

        this.code = res.text.split(/,/);

        if(this.code){
           this.entrepriseService.addOperationCadeau(this.code[1],this.entreprise._id,this.code[0]);
        }
      }).catch((e:any)=> console.log('Error is', e.name));
  }

  scannerAvoirDepense(){
    const options : BarcodeScannerOptions={
       preferFrontCamera:false,
       showFlipCameraButton:true,
       showTorchButton:false,
       torchOn:false,
       prompt:'Placer un code-barres à l\'intérieur de la zone de numérisation',
       resultDisplayDuration:100,
       orientation:'portrait'
     };
     this.qrScanner.scan(options).then(res=>{
        console.log('Scanned sommething', res);
        this.entrepriseService.addOperationAvoirDepense(res.text,this.entreprise._id);
        this.isAvoir = false;
       }).catch((e:any)=> console.log('Error is', e));
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

  /*scannerAvoir(){
    this.entrepriseService.presentAlertCadeau("bonjour alves");
  }*/
  /*io.ionic.starter*/

  closeScanner() {
    this.isOn = false;
  }

  IsAchat(){
    if(this.isAchat){
      this.isAchat = false;
    }else{
      this.isAchat = true;
    }
  }

  IsAvoir(){
    if(this.isAvoir){
      this.isAvoir = false;
    }else{
      this.isAvoir = true;
    }
  }

  ionViewDidEnter(){
    this.isCurrentView=true;
  }
  ionViewWillLeave(){
    this.isCurrentView = false;
  }

}
