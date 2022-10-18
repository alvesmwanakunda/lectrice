import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { io } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  header:any;

  private socket = io(environment.BASE_API_URL);


  constructor(
    private http:HttpClient,
    private alertController: AlertController
    ) { }

  addClient(client:Object, idEntreprise){
    return this.http.post(`${environment.BASE_API_URL}/client/${idEntreprise}`, client);

  }

  getEntrepriseByUser(){
    return this.http.get(`${environment.BASE_API_URL}/entreprise/user`)
  }

  getClientByEntreprise(idEntreprise){
    return this.http.get(`${environment.BASE_API_URL}/operations/${idEntreprise}`)
  }

  listOperationUserByAchat(idEntreprise){
    return this.http.get(`${environment.BASE_API_URL}/operations/list/achat/${idEntreprise}`)
  }

  getCountPointByEntreprise(idEntreprise){
    return this.http.get(`${environment.BASE_API_URL}/count/point/${idEntreprise}`)
  }

  getCountAchatByEntreprise(idEntreprise){
    return this.http.get(`${environment.BASE_API_URL}/count/achat/${idEntreprise}`)
  }

  getCountDepenseByEntreprise(idEntreprise){
    return this.http.get(`${environment.BASE_API_URL}/count/depense/entreprise/${idEntreprise}`)
  }

  listDepenseByEntreprise(idEntreprise){
    return this.http.get(`${environment.BASE_API_URL}/depense/entreprise/${idEntreprise}`)
  }

  listDepenseByEntrepriseDuplic(idEntreprise){
    return this.http.get(`${environment.BASE_API_URL}/depense/duplic/entreprise/${idEntreprise}`)
  }

  listAvoirEntreprise(idEntreprise){
    return this.http.get(`${environment.BASE_API_URL}/list/avoir/entreprise/${idEntreprise}`)
  }

  countAvoirEntreprise(idEntreprise){
    return this.http.get(`${environment.BASE_API_URL}/list/count/entreprise/${idEntreprise}`)
  }

  countAvoirDepenseEntreprise(idEntreprise){
    return this.http.get(`${environment.BASE_API_URL}/list/depense/entreprise/${idEntreprise}`)
  }

  countAvoirEncaisseEntreprise(idEntreprise){
    return this.http.get(`${environment.BASE_API_URL}/list/encaisse/entreprise/${idEntreprise}`)
  }

  getUser(){
    return this.http.get(`${environment.BASE_API_URL}/user`)
  }

  updateUser(user){
    return this.http.put(`${environment.BASE_API_URL}/user`,user)
  }

  updatePassword(body){
    return this.http.post(`${environment.BASE_API_URL}/profil/password`,body)
  }

  updateConnexion(){
    return this.http.get(`${environment.BASE_API_URL}/update/connexion`)
  }

  //Detail client

  getClientByVisite(idOperation){
    return this.http.get(`${environment.BASE_API_URL}/get/client/operation/${idOperation}`)
  }

  getClientByDepense(idDepense){
    return this.http.get(`${environment.BASE_API_URL}/get/client/depense/${idDepense}`)
  }

  getClientByAvoirDepense(idDepense){
    return this.http.get(`${environment.BASE_API_URL}/get/client/avoir/depense/${idDepense}`)
  }

  getClientByAvoirEncaisse(idEncaisse){
    return this.http.get(`${environment.BASE_API_URL}/get/client/avoir/encaisse/${idEncaisse}`)
  }

  //Fin

  addOperationVisite(idUser, idEntreprise){
    return this.http.get(`${environment.BASE_API_URL}/operation/visite/${idUser}/${idEntreprise}`).subscribe((res:any)=>{
      try {
           console.log("Response", res);
           this.socket.emit('get_visite', res.message.point);
           this.presentAlert();
      } catch (error) {
        console.log("Erreur", error);
        this.presentAlertError();
      }
    })
  }

  addOperationAchat(idUser, idEntreprise, montant){

    return this.http.put(`${environment.BASE_API_URL}/operation/achat/${idUser}/${idEntreprise}`,montant).subscribe((res:any)=>{
      try {
           console.log("Response",res);
           this.socket.emit('get_visite', res.message.point);
           this.presentAlert();
      } catch (error) {
        console.log("Erreur", error);
        this.presentAlertError();
      }
    })
  }

  addOperationAvoir(idUser, idEntreprise, montant){

    return this.http.put(`${environment.BASE_API_URL}/operation/avoir/${idUser}/${idEntreprise}`,montant).subscribe((res:any)=>{
      try {
           console.log("Response",res);
           this.presentAlert();
      } catch (error) {
        console.log("Erreur", error);
        this.presentAlertError();
      }
    })
  }

  addOperationCadeau(idUser, idEntreprise, idCadeau){

    return this.http.get(`${environment.BASE_API_URL}/operation/cadeau/${idUser}/${idEntreprise}/${idCadeau}`).subscribe((res:any)=>{
      try {
           console.log("Response",res);
           //'Succès'
           if(res.message=="Votre code cadeau a été scanné avec succès"){

            this.socket.emit('get_visite', res.operation.point);
            this.socket.emit('get_depense', res.point);

            this.header="Succès";
            this.presentAlertCadeau(res.message, this.header);

           }else{

            this.header="Erreur";
            this.presentAlertCadeau(res.message, this.header);
           }
           
           
      } catch (error) {
        console.log("Erreur", error);
        this.presentAlertError();
      }
    })
  }

  addOperationAvoirDepense(idAvoir, idEntreprise){

    return this.http.get(`${environment.BASE_API_URL}/avoir/encaisse/${idAvoir}/${idEntreprise}`).subscribe((res:any)=>{
      try {
           console.log("Response",res);
           this.header="Succès";
           this.presentAlertCadeau(res.message,this.header);
      } catch (error) {
        console.log("Erreur", error);
        this.presentAlertError();
      }
    })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Succès',
      message: 'Transaction a été effectuée avec succès.',
      buttons: ['Fermer']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async presentAlertError() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class-error',
      header: 'Erreur',
      message: 'Echec de la transaction veuillez réessayer',
      buttons: ['Fermer']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async presentAlertCadeau(message,header) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: ['Fermer']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  
}
