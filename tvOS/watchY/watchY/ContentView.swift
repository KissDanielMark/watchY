//
//  ContentView.swift
//  watchY
//
//  Created by Kiss Dániel Márk on 27/01/2024.
//

import SwiftUI
import AVKit

struct ContentView: View {
    @State private var isPlaying = false
    
    var body: some View {
        VStack {
            VideoPlayer(url: URL(string: "localhost:3001/movie")!, isPlaying: $isPlaying)
                .frame(width: 300, height: 300)
            
            Button(action: {
                print("Play button pressed")
                testServer()
                isPlaying = true
            }) {
                Image(systemName: "play.circle.fill")
                    .font(.system(size: 50))
                    .foregroundColor(.blue)
            }
        }
        .padding()
    }

    // Function to test server using URLSession
    private func testServer() {
        guard let url = URL(string: "http://127.0.0.1:3001/movie") else {
            print("Invalid URL")
            return
        }
        
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("Error fetching data: \(error)")
            } else if let data = data {
                print("Data received successfully. Length: \(data.count) bytes")
            }
        }
        
        task.resume()
    }
}

struct VideoPlayer: UIViewControllerRepresentable {
    let url: URL
    @Binding var isPlaying: Bool
    
    func makeUIViewController(context: Context) -> AVPlayerViewController {
        do {
            let player = AVPlayer(url: url)
            let playerViewController = AVPlayerViewController()
            playerViewController.player = player
            return playerViewController
        } catch {
            print("Error creating AVPlayer: \(error)")
            fatalError("Failed to create AVPlayer")
        }
    }

    
    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {
        if isPlaying {
            uiViewController.player?.play()
        } else {
            uiViewController.player?.pause()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
            


#Preview {
    ContentView()
}
