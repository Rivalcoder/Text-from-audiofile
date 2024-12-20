// src/app/api/chat/send.js
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

const google = createGoogleGenerativeAI({
  apiKey: process.env.API_KEY,
});

export async function POST(request) {
  try {
    console.log("Running Bro")
    const formData = await request.formData();
    const audioFile = formData.get('file');
    if (!audioFile) {
      return NextResponse.json({ 
        success: false, 
        error: 'No audio file provided' 
      }, { status: 400 });
    }

    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type. Please provide an audio file.' 
      }, { status: 400 });
    }

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const base64Audio = audioBuffer.toString('base64');

    const transcription = await generateText({
      model: google('gemini-1.5-flash-exp-0827'),
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: "Convert Audio To Text and remove audio timing in the response like 00.01 like that" },
          { type: 'file', data: base64Audio, mimeType: audioFile.type }
          
        ]
      }]
    });

    if (!transcription?.text) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to transcribe audio' 
      }); 
    }

    return NextResponse.json({ 
      success: true, 
      transcription: transcription.text 
    });

  } catch (error) {
    console.error('Error in voice', error);
    return NextResponse.json({ 
      success: false, 
      error: 'An error occurred during transcription' 
    }, { status: 500 }); 
  }
}
