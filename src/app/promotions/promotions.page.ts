import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
 } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import { EntrepriseService } from '../shared/services/entreprise.service';
import { LoadingController  } from '@ionic/angular';





@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.page.html',
  styleUrls: ['./promotions.page.scss'],
})
export class PromotionsPage implements OnInit {

  isCode:boolean=false;
  codeForm: FormGroup;
  codeFormErrors:any;
  private isCurrentView:boolean;
  subscriptions: Subscription = new Subscription();
  displayWarning: boolean;
  submitted: boolean = false;
  entreprise:any;


  constructor(
    private platform: Platform,
    private qrScanner: BarcodeScanner,
    private entrepriseService: EntrepriseService,
    private loadingController: LoadingController,
    ) {

    this.codeFormErrors = {
      code:{}
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
    code:[
      {
        type:"required",
        message:"Ce champ est requis"
      }
    ],

  };

  ngOnInit() {

    this.codeForm= new FormGroup({
      code:new FormControl("",[Validators.required]),
    });
    this.getEntreprise();
  }

  getEntreprise(){
    this.entrepriseService.getEntrepriseByUser().subscribe((res:any)=>{
      try {
        this.entreprise = res.body;
      } catch (error) {
        console.log("Erreur", error);
      }
    })
  }

  onFormValuesChanged(){
    for (const field in this.codeFormErrors){
      if(!this.codeFormErrors.hasOwnProperty(field)){
        continue;
      }
      this.codeFormErrors[field]={};
      const control = this.codeForm.get(field);
      if(control && control.dirty && !control.valid){
        this.codeForm[field] = control.errors;
      }
    }
  }

  trueCode(){
    this.isCode=true
  }
  falseCode(){
    this.isCode =!this.isCode
  }

  addCode():void{

    this.submitted=true;

    if(!this.codeForm.invalid){
      this.entrepriseService.verifyQrcodeMessageFormulaire(this.codeForm.value, this.entreprise._id).subscribe((res:any)=>{

        this.loadingPresent("ifOfLoading").then((result)=>{
          try {
              console.log("Reponse", res)
              if(res.success){
                 this.entrepriseService.presentAlertMessage();
              }else{
                 this.entrepriseService.presentAlertMessageError();
              }

              this.loadingDismiss("ifOfLoading");
          } catch (error) {
            this.loadingDismiss("ifOfLoading");
            console.log("Erreur ", error);
          }
  
        }).catch((err)=>{
          this.loadingDismiss("ifOfLoading");
        })
      })
    }
  }

  scanneCode():void{

    //this.entrepriseService.verifyQrcodeMessage("647e770051862ed9b7a8e489", this.entreprise._id);

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

        this.entrepriseService.verifyQrcodeMessage(res.text, this.entreprise._id);

      }).catch((e:any)=> console.log('Error is', e.name));

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

  ionViewDidEnter(){
    this.isCurrentView=true;
  }
  ionViewWillLeave(){
    this.isCurrentView = false;
  }

}
