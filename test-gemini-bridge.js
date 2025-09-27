// Test the Gemini bridge API with the correct model
async function testBridge() {
  console.log('Testing Gemini Bridge with gemini-2.5-flash model...\n')

  try {
    const response = await fetch('http://localhost:3000/api/gemini-bridge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userChoice: "I'm feeling overwhelmed by all these career choices",
        nextSpeaker: "Samuel"
      })
    })

    if (!response.ok) {
      console.error('API Error:', response.status)
      const text = await response.text()
      console.error('Response:', text)
      return
    }

    const data = await response.json()
    console.log('✅ SUCCESS! Bridge text generated:')
    console.log(`   "${data.bridge}"`)
    console.log('\nThe Gemini bridge is now working correctly!')
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testBridge()