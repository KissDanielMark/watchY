//
//  Video.swift
//  Stream.it tvOS
//
//  Created by Mark Howard on 27/09/2021.
//http://127.0.0.1:3001/movie

import SwiftUI
import AVKit
import AVFoundation

struct Video: View {
    @State var vidURL = URL(string: "/")
    @State var urlText = ""
    @State var show = false
    let ws = Websocket()
    var body: some View {
        @State var play = AVPlayer(url: (vidURL ?? URL(string: "/"))!)
        
        VStack {
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
                vidURL = URL(string: "http://"+urlText+":3001/movie")
                ws.connect(urlString: urlText)
                self.show = true
            }) {
                Text("Done")
            }
            Spacer()
        }
            .sheet(isPresented: $show) {
                AVPlayerView(videoURL: $vidURL, player: play)
                    .edgesIgnoringSafeArea(.all)
                    .onDisappear() {
                        play.pause()
                    }
                    .onPlayPauseCommand(perform: {
                        ws.playPausePressed()
                            })
            }
    }
}

struct Video_Previews: PreviewProvider {
    static var previews: some View {
        Video()
    }
}


struct AVPlayerView: UIViewControllerRepresentable {

    @Binding var videoURL: URL?
    var player: AVPlayer
    
    func updateUIViewController(_ playerController: AVPlayerViewController, context: Context) {
        playerController.modalPresentationStyle = .fullScreen
        playerController.allowsPictureInPicturePlayback = true
        playerController.player = player
        playerController.player?.play()
    }

    func makeUIViewController(context: Context) -> AVPlayerViewController {
        return AVPlayerViewController()
    }
}

class Websocket: ObservableObject {
    @Published var messages = [String]()
    var isPlaying = false
    
    private var webSocketTask: URLSessionWebSocketTask?
    
    init() {
       print("WebSocket init")
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
                case .data(_):
                    // Handle binary data
                    break
                @unknown default:
                    break
                }
            }
        }
    }
    
    func sendMessage(_ message: String) {
        guard message.data(using: .utf8) != nil else { return }
        webSocketTask?.send(.string(message)) { error in
            if let error = error {
                print(error.localizedDescription)
            }
        }
    }
    
    func playPausePressed(){
        print("playPause_pressed")
        if(isPlaying == false){
            print("START")
            isPlaying = true
            sendMessage("start")
        }
        else{
            print("STOP")
            isPlaying = false
            sendMessage("stop")
        }
        
    }
    
}
