import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { AlertController, ToastController, LoadingController  } from '@ionic/angular';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {

  changepasswordForm: FormGroup;
  submitted = false;
  isMailLoading=false;
  formErrors: any;
  hide:boolean=true;
  hideC:boolean=true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private loadingController: LoadingController
  ) { 
    this.formErrors={
      password:{}
    };
  }
  code: string;
  phone:string;
  changepassword = false;
  passwordchanged = false;
  passwordchangederror = false;

  account_validation_messagespassword = {
    confirmpassword: [
      { type: "required", message: "Vous devez confirmer le mot de passe" },
      { type: "minlength", message: "Mot de passe incorrect." }
    ],
    password: [
      { type: "required", message: "Le mot de passe est obligatoire" },
      { type: "minlength", message: "Mot de passe incorrect. " },
      {
        type: "pattern",
        message:
          "Le mot de passe doit comporter au moins 8 caracteres et doit comporter au moins une lettre majuscule, une lettre minuscule et un chiffre"
      }
    ]
  };

  onFormValuesChanged() {
    for (const field in this.formErrors) {
      // console.log(field);
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.formErrors[field] = {};

      // Get the contro
      const control = this.changepasswordForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.changepasswordForm[field] = control.errors;
      }
    }
  }

  ngOnInit() {

    this.code = this.route.snapshot.paramMap.get('code');
    this.phone = this.route.snapshot.paramMap.get('phone');

    console.log("Code", this.code);
    console.log("Email", this.phone);

    let password = new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$")
    ]);
    let confirmpassword = new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      CustomValidators.equalTo(password)
    ]);

    this.changepasswordForm = this.formBuilder.group({
      password: password,
      confirmpassword: confirmpassword
    });
  }

  onChangePassword(){
    this.submitted = true;
    this.isMailLoading = true;
    let query = {code:this.code,phone:this.phone};
    Object.assign(query, this.changepasswordForm.value);

    this.loadingPresent("ifOfLoading").then((res)=>{

      this.authService.resetPasswordCode(query)
        .then(res => {
          console.log("Res", res);
          if(!res.success){
            this.passwordchangederror = true;
            this.isMailLoading = false;
            this.loadingDismiss("ifOfLoading");
          }else{
            this.passwordchanged = true;
            this.isMailLoading = false;
            this.loadingDismiss("ifOfLoading");
          }
        })
        .catch(err =>{
          console.log("Erreur", err);
          this.loadingDismiss("ifOfLoading");
        });

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

}
