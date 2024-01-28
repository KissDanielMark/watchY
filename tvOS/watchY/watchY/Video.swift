//
//  Video.swift
//  Stream.it tvOS
//
//  Created by Mark Howard on 27/09/2021.
//http://127.0.0.1:3001/movie

import SwiftUI
import AVKit
import AVFoundation
import Foundation

struct Message: Codable {
    let currentTime: Double
    let state: String
}


struct Video: View {
    @State var vidURL = URL(string: "/")
    @State var urlText = ""
    @State var show = false
    let ws = Websocket()
    @State var player = AVPlayer()
    var body: some View {
        
        VStack {
            
            // Add an Image view
            Text("watcHy").font(.custom(
                "AmericanTypewriter",
                fixedSize: 36).bold())
            .foregroundColor(.yellow)
            Image(uiImage: UIImage(named: "watchy7")!) // You can replace "photo" with the name of the system image or use a custom image
                .resizable()
                .frame(width: 350, height: 350) // Adjust the size as needed
            Spacer()
            
            HStack {
                Spacer()
                Text("Enter URL: ")
                Spacer()
            TextField("URL...", text: $urlText)
                Spacer()
        }
            .padding()
            Button(action: {
                ws.setPalyer(inputPlayer: player)
                vidURL = URL(string: "http://"+urlText+":3001/movie")
                ws.connect(urlString: urlText)
                self.show = true
            }) {
                Text("Done")
            }
            Spacer()
        }.onAppear(perform: {
            player = AVPlayer(url: (vidURL ?? URL(string: "/"))!)
        })
            .sheet(isPresented: $show) {
                AVPlayerView(player: $player)
                    .edgesIgnoringSafeArea(.all)
                    .onDisappear() {
                        print("ez")
                        player.pause()
                    }
                    .onPlayPauseCommand(perform: {
                        ws.playPausePressed()
                    })
            }
    }
}

struct AVPlayerView: UIViewControllerRepresentable {
    
    @Binding var player: AVPlayer
    
    func updateUIViewController(_ playerController: AVPlayerViewController, context: Context) {
        playerController.modalPresentationStyle = .fullScreen
        playerController.allowsPictureInPicturePlayback = true
        playerController.player = player
        //playerController.player?.play()
    }

    func makeUIViewController(context: Context) -> AVPlayerViewController {
        return AVPlayerViewController()
    }
}

class Websocket: ObservableObject {
    @Published var messages = [String]()
    var isPlaying = false
    var player: AVPlayer
    
    private var webSocketTask: URLSessionWebSocketTask?
    
    init() {
       print("WebSocket init")
        player = AVPlayer()
    }
    
    func setPalyer(inputPlayer: AVPlayer){
        print("Settingn player")
        player = inputPlayer
        print(player.currentTime().seconds)
    }
    
    func connect(urlString: String) {
        print("Connct to ws")
        guard let url = URL(string: "ws://"+urlString+":3000/") else { return }
        let request = URLRequest(url: url)
        webSocketTask = URLSession.shared.webSocketTask(with: request)
        webSocketTask?.resume()
        receiveMessage()
    }
    
    private func receiveMessage() {
        webSocketTask?.receive { result in
            switch result {
            case .failure(let error):
                print(error.localizedDescription)
            case .success(let message):
                switch message {
                case .string(let text):
                    print(text)
                    self.messages.append(text)

                case .data(let binaryData):
                    // Handle binary data
                    print("Received binary data")
                    print(binaryData)
                    
                    // Convert binary data to Data
                    let data = Data(binaryData)

                    // Assuming the received data is a JSON string, try to parse it
                    do {
                        let jsonObject = try JSONSerialization.jsonObject(with: data, options: [])
                        // Handle the JSON object as needed
                        print("Received JSON data: \(jsonObject)")
                        if let jsonDictionary = jsonObject as? [String: Any] {
                                // Access the "currentTime" field
                                if let currentTime = jsonDictionary["currentTime"] as? Double {
                                    print("Current Time: \(currentTime)")
                                } else {
                                    print("Field 'currentTime' not found or not a Double.")
                                }

                                // Access the "state" field
                                if let state = jsonDictionary["state"] as? String {
                                    print("State: \(state)")
                                } else {
                                    print("Field 'state' not found or not a String.")
                                }
                            
                            self.handleMessage(currentTime: jsonDictionary["currentTime"] as? Double ?? 0.0, state: jsonDictionary["state"] as? String ?? "stop")
                            
                            
                            
                            } else {
                                print("JSON data is not a dictionary.")
                            }
                    } catch {
                        print("Error parsing JSON: \(error.localizedDescription)")
                    }

                @unknown default:
                    break
                }
            }
        }
    }

    
    
    func sendMessage(_ message: Message) {
        do {
            let jsonData = try JSONEncoder().encode(message)
            guard let jsonString = String(data: jsonData, encoding: .utf8) else {
                return
            }
            webSocketTask?.send(.string(jsonString)) { error in
                if let error = error {
                    print(error.localizedDescription)
                }
            }
            receiveMessage()
        } catch {
            print(error.localizedDescription)
        }
    }
    
    func playPausePressed(){
        print("playPause_pressed")
        if(isPlaying == false){
            playVideo()
        }
        else{
            pauseVideo()
        }
    }
    
    func playVideo(){
        print("Play video")
        isPlaying.toggle()
        sendMessage(Message(currentTime: player.currentTime().seconds, state: "start"))
        player.play()
    }
    
    func pauseVideo(){
        print("Pausing video")
        player.pause()
        isPlaying.toggle()
        sendMessage(Message(currentTime: player.currentTime().seconds, state: "stop"))
    }
    
    func sync(inputSeconds: Double){
        print("Sync")
        DispatchQueue.main.async {
            print("meg ez is jo")
            // Perform UI-related updates here
            let seekTime = CMTime(seconds: inputSeconds, preferredTimescale: 1)
            self.player.seek(to: seekTime)
        }
        
    }
    
    func handleMessage(currentTime: Double, state: String){
        sync(inputSeconds: currentTime)
        print("ez mar nme tetsuiks")
        print(state)
        DispatchQueue.main.async {
            if(state == "start")
            {
                self.player.play()
            }
            else if(state == "stop")
            {
                self.player.pause()
            }
        }
    }
    
}
