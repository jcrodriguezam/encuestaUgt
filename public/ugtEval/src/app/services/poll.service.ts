import { Injectable } from '@angular/core';
// import core firebase client (required)
import firebase from '@firebase/app';
// import Firebase Authentication (optional)
import '@firebase/auth';
// import Firebase Realtime Database (optional)
import '@firebase/database';
// import Cloud Firestore (optional)
import '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  public db = firebase.firestore();
  constructor() { }

  getPoll = (id) => {
    let that = this;
    let promise = new Promise(function(resolve, reject) {
      that.db.collection("polls").where("id", "==", id)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              resolve(doc.data());
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    });

    return promise;
  }

  createPoll = (poll) =>{
    let that = this;
    let promise = new Promise(function(resolve, reject) {
      that.db.collection("polls").add(poll)
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          resolve(docRef.id)
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    });

    return promise;
  }

  createPollAnswers = (pollAnswers) => {
    let that = this;
    let promise = new Promise(function(resolve, reject) {
      that.db.collection("answers").add(pollAnswers)
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          resolve(docRef.id)
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    });

    return promise;
  }

  getPollAnswers = (pollId) => {
    let that = this;
    let promise = new Promise(function(resolve, reject) {
      that.db.collection("answers").where("id", "==", pollId)
        .get()
        .then(function(querySnapshot) {
          const result = [];
            querySnapshot.forEach(function(doc) {
              result.push(doc.data());
            });
            
            resolve(result)
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    });

    return promise;
  }
}
