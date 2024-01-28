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
    @State var urlText = "http://16.170.232.25:3001/movie"
    @State var show = false
    var body: some View {
        let play = AVPlayer(url: (vidURL ?? URL(string: "/"))!)
        let ws = Websocket()
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
            Button(action: {vidURL = URL(string: urlText)
                self.show = true
            }) {
                Text("Done")
            }
            Spacer()
        }
            .sheet(isPresented: $show) {
                AVPlayerVieww(videoURL: $vidURL, player: play)
                    .edgesIgnoringSafeArea(.all)
                    .onDisappear() {
                        play.pause()
                    }
            }
    }
}

struct Video_Previews: PreviewProvider {
    static var previews: some View {
        Video()
    }
}


struct AVPlayerVieww: UIViewControllerRepresentable {

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
    
    private var webSocketTask: URLSessionWebSocketTask?
    
    init() {
        self.connect()
    }
    
    private func connect() {
        print("Connct to ws")
        guard let url = URL(string: "ws://localhost:3000/") else { return }
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
                    self.messages.append(text)
                case .data(let data):
                    // Handle binary data
                    break
                @unknown default:
                    break
                }
            }
        }
    }
    
    func sendMessage(_ message: String) {
        guard let data = message.data(using: .utf8) else { return }
        webSocketTask?.send(.string(message)) { error in
            if let error = error {
                print(error.localizedDescription)
            }
        }
    }
}
