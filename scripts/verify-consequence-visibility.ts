
import { queueGiftForChoice, getReadyGiftsForCharacter, formatGiftAsSamuelDialogue, resetGiftQueue, GIFT_TRIGGERS } from '../lib/delayed-gifts'

console.log('🧪 Verifying Consequence Visibility Systems...')

// 1. Setup
resetGiftQueue()
const TEST_CHOICE_ID = 'maya_encourage_patience' // Known trigger
const TEST_CONTEXT = 'You told Maya to take her time'

// 2. Test Queueing with Context
console.log('\n[1] Testing Gift Queueing with Context...')
const gift = queueGiftForChoice(TEST_CHOICE_ID, 'maya', TEST_CONTEXT)

if (!gift) {
    console.error('❌ Failed to queue gift')
    process.exit(1)
}

if (gift.giftContext?.sourceChoiceText === TEST_CONTEXT) {
    console.log('✅ Gift queued with correct context:', gift.giftContext)
} else {
    console.error('❌ Gift missing context:', gift)
    process.exit(1)
}

// 3. Test Formatting
console.log('\n[2] Testing Attribution Formatting...')
const dialogue = formatGiftAsSamuelDialogue(gift)

if (dialogue.includes('(Recall: You told Maya')) {
    console.log('✅ Attribution present in dialogue:\n', dialogue)
} else {
    console.error('❌ Attribution missing from dialogue:\n', dialogue)
    process.exit(1)
}

console.log('\n✨ All Consequence Visibility verification steps passed!')
