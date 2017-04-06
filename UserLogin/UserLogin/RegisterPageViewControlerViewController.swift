//
//  RegisterPageViewControlerViewController.swift
//  UserLogin
//
//  Created by Edouard Lefebvre du Prey on 23/02/2016.
//  Copyright © 2016 Ed-Kada. All rights reserved.
//

import UIKit

class RegisterPageViewControlerViewController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var userEmailTextField: UITextField!
    @IBOutlet weak var userPasswordTextField: UITextField!
    @IBOutlet weak var repeatPasswordTextField: UITextField!
    /*
    func userEmailTextFieldShouldReturn(userEmailTextField: UITextField) -> Bool {
        self.view.endEditing(true)
        return false
    }
    
    func userPasswordTextFieldShouldReturn(userPasswordTextField: UITextField) -> Bool {
        self.view.endEditing(true)
        return false
    }*/
    
    func textFieldShouldReturn(_ repeatPasswordTextField: UITextField) -> Bool {
        self.view.endEditing(true)
        return false
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        
       /* self.userEmailTextField.delegate = self
        self.userPasswordTextField.delegate = self*/
        self.repeatPasswordTextField.delegate = self
    }

    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func registerButtonTapped(_ sender: AnyObject) {
        
        let userEmail = userEmailTextField.text
        let userPassword = userPasswordTextField.text
        let userRepeatPassword = repeatPasswordTextField.text
        
        //Check for empty fields
        if (userEmail!.isEmpty || userPassword!.isEmpty || userRepeatPassword!.isEmpty)
        {
            //Display alert message
            
            displayMyAlertMessage("All fields are required")
            
            return
        }
        
        //Check is password match
        if (userPassword != userRepeatPassword)
        {
            //display an alert message
            
            
            displayMyAlertMessage("Password do not match")

            
            return
        }
        
        //Check is password change
        /*
        if (userPassword == "Password:"){
            displayMyAlertMessage("All fields are required")
        }
        else {
        if (userRepeatPassword == "Password:"){
            displayMyAlertMessage("All fields are required")
        }
        }*/
        
        //Check is valid Email
        if (!isValidEmail(userEmail!)){
            
            displayMyAlertMessage("invalid Email")
            
        }
        
        //Store data
        UserDefaults.standard.set(userEmail, forKey: "userEmail")
        UserDefaults.standard.set(userPassword, forKey: "userPassword")
        UserDefaults.standard.synchronize()
        
        
        //Display alert message with confirmation
        let myAlert = UIAlertController(title:"Alert", message:"Registration is succesfull. Thank you!", preferredStyle: UIAlertControllerStyle.alert)
        
        let okAction = UIAlertAction(title:"ok", style:UIAlertActionStyle.default){ action in
            self.dismiss(animated: true, completion: nil)
        }
        
        myAlert.addAction(okAction)
        self.present(myAlert, animated: true, completion: nil)
        
        
    }

    func displayMyAlertMessage(_ userMessage:String)
    {
        let myAlert = UIAlertController(title:"Alert", message:userMessage, preferredStyle: UIAlertControllerStyle.alert)
        
        let okAction = UIAlertAction(title:"ok", style:UIAlertActionStyle.default, handler:nil)
        
        myAlert.addAction(okAction)
        
        self.present(myAlert, animated: true, completion:nil)
        
    }
    
    func isValidEmail(_ testStr:String) -> Bool {
        
        let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9-]+\\.[A-Za-z]{2,}"
        
        let emailTest = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
        
        let result = emailTest.evaluate(with: testStr)
        
        return result
        
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
