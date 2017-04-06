//
//  ViewController.swift
//  UserLogin
//
//  Created by Edouard Lefebvre du Prey on 23/02/2016.
//  Copyright © 2016 Ed-Kada. All rights reserved.
//

import UIKit
import MediaPlayer
import MobileCoreServices
import AVKit
import AVFoundation

class ViewController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func viewDidAppear(_ animated: Bool) {
        
        let isUserLoggedIn = UserDefaults.standard.bool(forKey: "isUserLoggedIn")
        if (!isUserLoggedIn){
            self.performSegue(withIdentifier: "loginView", sender: self)
        }
    }

    @IBAction func logoutButtonTapped(_ sender: AnyObject) {
        UserDefaults.standard.set(false, forKey: "isUserLoggedIn")
        UserDefaults.standard.synchronize()
        
        self.performSegue(withIdentifier: "loginView", sender: self)
    }

    
    @IBOutlet weak var vwVideoView: UIView!

    @IBAction func playVideo(_ sender: Any) {
        let videoURL = NSURL(string: "https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4")
        let player = AVPlayer(url: videoURL! as URL)
        let playerViewController = AVPlayerViewController()
        playerViewController.player = player
        self.present(playerViewController, animated: true) {
            playerViewController.player!.play()
        }
    }

    
/*
    var objMoviePlayerController: MPMoviePlayerController = MPMoviePlayerController()
    var urlVideo :NSURL = NSURL()
    
    

    @IBAction func chooseVideoButton(_ sender: AnyObject) {
        
            let ipcVideo = UIImagePickerController()
            ipcVideo.delegate = self
            ipcVideo.sourceType = UIImagePickerControllerSourceType.photoLibrary
            let kUTTypeMovieAnyObject : AnyObject = kUTTypeMovie as AnyObject
            ipcVideo.mediaTypes = [kUTTypeMovieAnyObject as! String]
            self.present(ipcVideo, animated: true, completion: nil)
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        urlVideo = info[UIImagePickerControllerMediaURL] as! NSURL
        self.dismiss(animated: true, completion: nil)
        objMoviePlayerController = MPMoviePlayerController(contentURL: urlVideo as URL!)
        objMoviePlayerController.movieSourceType = MPMovieSourceType.unknown
        objMoviePlayerController.view.frame = self.vwVideoView.bounds
        objMoviePlayerController.scalingMode = MPMovieScalingMode.aspectFill
        objMoviePlayerController.controlStyle = MPMovieControlStyle.embedded
        objMoviePlayerController.shouldAutoplay = true
        vwVideoView.addSubview(objMoviePlayerController.view)
        objMoviePlayerController.prepareToPlay()
        objMoviePlayerController.play()
    }
 */
}

