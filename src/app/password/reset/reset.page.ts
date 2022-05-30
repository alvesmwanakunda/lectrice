import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { restResponse } from '../../shared/models/restResponse';
import { AlertController, ToastController, LoadingController  } from '@ionic/angular';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {

  phone:string;
  confirmphoneForm: FormGroup;
  formErrors:any;
  code:any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public FormBuilder: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController
  ) { 
    this.formErrors={
      code1:{},
      code2:{},
      code3:{},
      code4:{},
    }
  }

  ngOnInit() {

    this.confirmphoneForm = new FormGroup({
      code1:new FormControl('', Validators.minLength(1)),
      code2:new FormControl('', Validators.minLength(1)),
      code3:new FormControl('', Validators.minLength(1)),
      code4:new FormControl('', Validators.minLength(1))
    });
    this.phone = this.route.snapshot.paramMap.get('phone');
  }

  onCode():void{

    this.code = this.confirmphoneForm.get('code1').value+""+this.confirmphoneForm.get('code2').value+""+ this.confirmphoneForm.get('code3').value+""+ this.confirmphoneForm.get('code4').value;
    //console.log("Code", this.code);

    this.loadingPresent("ifOfLoading").then((res)=>{

      this.authService.validCode({code:this.code, phone:this.phone}).then(res=>{
        let response = <restResponse>res;
        console.log(response);
        if(!response.success){
          this.formErrors['code1'].notfound=true;
          this.loadingDismiss("ifOfLoading");
        }else{
          this.loadingDismiss("ifOfLoading");
          this.router.navigate(['password/new-password',this.phone,this.code]);
        }
      }).catch(err => {
        console.log("Error", err);
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
