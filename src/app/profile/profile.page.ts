import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
 } from '@angular/forms';
 import { EntrepriseService } from '../shared/services/entreprise.service';
 import { LoadingController, ToastController } from '@ionic/angular';
 import { NgForm } from '@angular/forms';
 import { User } from '../shared/class/user';
 import { CustomValidators } from "ng2-validation";
 import { Router } from '@angular/router';
 import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user:User;
  userForm: FormGroup;
  myToast:any;
  userPassword:any;

  passwordForm: FormGroup;
  passwordFormErrors: any;
  hideP = true;
  hidePassword = true;
  hideLP = true;
  isInfo:boolean=true;

  private isCurrentView:boolean;
  private displayWarning:boolean;
  subscriptions: Subscription = new Subscription();

  constructor(
    private entrepriseService:EntrepriseService,
    private loadingController:LoadingController,
    private toast: ToastController,
    private router: Router,
    private platform: Platform,
  ) { 
    this.passwordFormErrors = {
      lostpassword: {},
      password: {},
      confirmpassword:{}
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
   
    confirmpassword: [
      { type: "required", message: "Vous devez confirmer le mot de passe" },
      { type: "minlength", message: "Mot de passe incorrect." },
    ],
    password: [
      { type: "required", message: "Le mot de passe est obligatoire" },
     // { type: "minlength", message: "Mot de passe incorrect. " },
      {
        type: "pattern",
        message:
          "Le mot de passe doit comporter au moins 8 caracteres,une lettre majuscule, une lettre minuscule et un chiffre",
      },
    ],
    lostpassword:[
      { type: "required", message: "L'ancien mot de passe est obligatoire" },
    ]
    
  };  

  ngOnInit() {

    this.getUserInfo();

    let password = new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?![#?!@$%^&*-]).{8,}$"
      ),
    ]);
    let confirmpassword = new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      CustomValidators.equalTo(password),
    ]);

    let lostpassword = new FormControl("", [
      Validators.required
    ]);

    this.passwordForm = new FormGroup({
      password:password,
      confirmpassword: confirmpassword,
      lostpassword:lostpassword
    });

    this.passwordForm.valueChanges.subscribe(()=>{
      this.onLoginFormValuesChanged();
    });
  }

  onLoginFormValuesChanged() {
    for (const field in this.passwordFormErrors) {
      if (!this.passwordFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.passwordFormErrors[field] = {};

      // Get the contro
      const control = this.passwordForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.passwordFormErrors[field] = control.errors;
      }
    }
  }

  getUserInfo(){
    this.entrepriseService.getUser().subscribe((res:any)=>{
      try {
            console.log("User", res);
            this.user = res.message;
            if(this.user){
              this.userForm = new FormGroup({
                nom: new FormControl(this.user.nom,[Validators.required]),
                prenom: new FormControl(this.user.nom,[Validators.required]),
                phone: new FormControl(this.user.phone,null)
              })
            }
      } catch (error) {
        console.log("Error", error);
      }
    })
  }

  updateUser(user:User){
    console.log("Payload",user);
    this.loadingPresent("ifOfLoading").then((res)=>{
      this.entrepriseService.updateUser(user).subscribe((res:any)=>{
        try {
          this.user = res.message;
          this.loadingDismiss("ifOfLoading");
          this.successToast();
          console.log("User", res);
        } catch (error) {
          console.log("Erreur", error);
          this.loadingDismiss("ifOfLoading");
          this.errorToast();
        }
      })
    }).catch((err)=>{
      this.loadingDismiss("ifOfLoading");
    }) 
  }

  onPasswordUser():void{
    this.userPassword = {};

    this.loadingPresent("ifOfLoading").then((res)=>{

      if(!this.passwordForm.invalid){
        Object.assign(this.userPassword, this.passwordForm.value);
        this.entrepriseService.updatePassword(this.userPassword).subscribe((res:any)=>{
          if(!res.success){
            this.passwordFormErrors["lostpassword"].notfound = true;
            this.loadingDismiss("ifOfLoading");
            this.errorToast();
          }else{
            this.loadingDismiss("ifOfLoading");
            this.successToast()
          }
        });
      }else{
        this.loadingDismiss("ifOfLoading");
      }
     
    }).catch((err)=>{
      this.loadingDismiss("ifOfLoading");
    }) 


    
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

  async successToast(){
    let myToast = await this.toast.create({
      message:'Votre profile a été modifié avec succès',
      duration:3000,
      position:'bottom',
      cssClass: 'my-custom-class',
    });
    myToast.present();
  }

  async errorToast(){
    let myToast = await this.toast.create({
      message:'Une erreur est survenue lors de la modification de profile',
      duration:3000,
      position:'bottom',
      cssClass: 'my-custom-class-error',
    });
    myToast.present();
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

  infoM(){
    if(this.isInfo){
      this.isInfo=false
    }else{
      this.isInfo=true;
    }
  }

}
