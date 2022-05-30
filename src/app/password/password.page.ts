import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController, LoadingController  } from '@ionic/angular';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {

  lostpasswordForm: FormGroup;
  submitted=false;
  formErrors:any;
  isMailLoading:boolean=false;
  passwordchangedok:boolean=false;
  accountnotfound:boolean=false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private loadingController: LoadingController
  ) { }

  account_validation_messages={
    emailorphone:[
      {
        type:"required",
        message:"Numéro téléphone obligatoire"
      },
      {
        type:"pattern",
        message:"Veuillez respecter le format"
      }
    ]
 };

  ngOnInit() {

    this.lostpasswordForm = this.formBuilder.group({
      emailorphone:[
        "",
        [
          Validators.required,
          Validators.pattern(
            "^((\\+\\d{1,3}(-| )?\\(?\\d\\)?(-| )?\\d{1,5})|(\\(?\\d{2,6}\\)?))(-| )?(\\d{3,4})(-| )?(\\d{4})(( x| ext)\\d{1,5}){0,1}$|(\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,6})+)"
          )
        ]

      ]
    });
  }


  onLostPassword() :void{

    this.isMailLoading = true;

    this.loadingPresent("ifOfLoading").then((res)=>{

      this.authService.lostPassword(this.lostpasswordForm.value)
      .then(res => {
        console.log("Response ", res);
        if(!res.success){
         this.isMailLoading = false;
         this.accountnotfound = true;
         this.loadingDismiss("ifOfLoading");
        } else{
          let emailregex = RegExp(
             /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
          let phone = this.lostpasswordForm.get("emailorphone").value;
          if(!emailregex.test(phone)){
             this.isMailLoading = false;
             this.accountnotfound = false;
             this.loadingDismiss("ifOfLoading");
             this.router.navigate(["password/reset", phone]);
          }else{
            this.isMailLoading = false;
            this.passwordchangedok = true;
            this.accountnotfound = false;
            this.loadingDismiss("ifOfLoading");
            this.router.navigate(["password/reset", phone]);
          }
        }
      })
      .catch(err=>{
        console.log("Error", err);
        this.loadingDismiss("ifOfLoading");
      })

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
