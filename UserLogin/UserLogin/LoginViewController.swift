//
//  LoginViewController.swift
//  UserLogin
//
//  Created by Edouard Lefebvre du Prey on 24/02/2016.
//  Copyright © 2016 Ed-Kada. All rights reserved.
//

import UIKit

class LoginViewController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var userEmailTextField: UITextField!
    @IBOutlet weak var userPasswordtextField: UITextField!
    /*
    func userEmailTextFieldShouldReturn(userEmailTextField: UITextField) -> Bool {
        self.view.endEditing(true)
        return false
    }
    
    func userPasswordtextFieldShouldReturn(userPasswordtextField: UITextField) -> Bool {
        self.view.endEditing(true)
        return false
    }
    */
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
      /*
        self.userEmailTextField.delegate = self
        self.userPasswordtextField.delegate = self*/
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func loginButtonTapped(_ sender: AnyObject) {
        
        let userEmail = userEmailTextField.text
        let userPassword = userPasswordtextField.text
        
        let userEmailStored = UserDefaults.standard.string(forKey: "userEmail")
        
        let userPasswordStored = UserDefaults.standard.string(forKey: "userPassword")
        
        if (userEmailStored == userEmail){
            if (userPasswordStored == userPassword){
                //login us succesfull
                
                UserDefaults.standard.set(true, forKey: "isUserLoggedIn")
                UserDefaults.standard.synchronize()
                
                self.dismiss(animated: true, completion: nil)
            }
            else {
                //Display alert message
                displayMyAlertMessage("This login doesn't exist")

            }
        }
        else {
            //Display alert message
            displayMyAlertMessage("This login doesn't exist")

        }
        
    }
    
    func displayMyAlertMessage(_ userMessage:String)
    {
        let myAlert = UIAlertController(title:"Alert", message:userMessage, preferredStyle: UIAlertControllerStyle.alert)
        
        let okAction = UIAlertAction(title:"ok", style:UIAlertActionStyle.default, handler:nil)
        
        myAlert.addAction(okAction)
        
        self.present(myAlert, animated: true, completion:nil)
        
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
