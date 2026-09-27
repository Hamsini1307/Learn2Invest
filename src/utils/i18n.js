import { useEffect } from 'react'

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
]

export const UI_TRANSLATIONS = {
  en: {
    appName: 'Learn2Invest',
    campusEdition: '3D Campus Edition',
    rankList: 'Rank List',
    logout: 'Logout',
    loginTitle: 'Student Portal Login',
    username: 'Username',
    email: 'Email Address',
    password: 'Password',
    chooseAvatar: 'Choose & Customize Avatar',
    outfitStyle: 'Outfit Theme',
    selectLevel: 'Select Starting Level',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    locked: 'Locked',
    enterCampus: 'Enter 3D Campus →',
    skipWalk: 'Skip Walk →',
    fullScreen: 'Full Screen',
    exitFullScreen: 'Exit Full Screen',
    arrowKeysHint: 'Use Arrow Keys (↑ ↓ ← →) to Walk Anywhere',
    rankListTitle: 'Campus Top Learners Rank List',
    rankListSubtitle: 'Live leaderboard of top investors & students across all levels',
    youTag: 'YOU',
    close: 'Close',
  },
  kn: {
    appName: 'ಲರ್ನ್2ಇನ್ವೆಸ್ಟ್ (Learn2Invest)',
    campusEdition: '3D ಕ್ಯಾಂಪಸ್ ಆವೃತ್ತಿ',
    rankList: 'ಶ್ರೇಣಿ ಪಟ್ಟಿ (Rank List)',
    logout: 'ಲಾಗ್ ಔಟ್',
    loginTitle: 'ವಿದ್ಯಾರ್ಥಿ ಪೋರ್ಟಲ್ ಲಾಗಿನ್',
    username: 'ಬಳಕೆದಾರರ ಹೆಸರು',
    email: 'ಇಮೇಲ್ ವಿಳಾಸ',
    password: 'ಪಾಸ್ವರ್ಡ್',
    chooseAvatar: 'ಅವತಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ',
    outfitStyle: 'ಉಡುಪಿನ ಶೈಲಿ',
    selectLevel: 'ಪ್ರಾರಂಭಿಕ ಹಂತವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    beginner: 'ಆರಂಭಿಕ (Beginner)',
    intermediate: 'ಮಧ್ಯಮ (Intermediate)',
    advanced: 'ಮುಂದುವರಿದ (Advanced)',
    locked: 'ಲಾಕ್ ಆಗಿದೆ',
    enterCampus: '3D ಕ್ಯಾಂಪಸ್ ಪ್ರವೇಶಿಸಿ →',
    skipWalk: 'ನಡಿಗೆ ಸ್ಕಿಪ್ ಮಾಡಿ →',
    fullScreen: 'ಪೂರ್ಣ ಪರದೆ (Full Screen)',
    exitFullScreen: 'ಪೂರ್ಣ ಪರದೆಯಿಂದ ನಿರ್ಗಮಿಸಿ',
    arrowKeysHint: 'ಎಲ್ಲಿಯಾದರೂ ನಡೆಯಲು ಬಾಣದ ಕೀಗಳನ್ನು (↑ ↓ ← →) ಬಳಸಿ',
    rankListTitle: 'ಕ್ಯಾಂಪಸ್ ಟಾಪ್ ಕಲಿಕಾರ್ಥಿಗಳ ಶ್ರೇಣಿ ಪಟ್ಟಿ',
    rankListSubtitle: 'ಎಲ್ಲಾ ಹಂತಗಳಲ್ಲಿನ ಅಗ್ರ ಹೂಡಿಕೆದಾರರು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳ ನೇರ ಪಟ್ಟಿ',
    youTag: 'ನೀವು',
    close: 'ಮುಚ್ಚಿ',
  },
  hi: {
    appName: 'लर्न2इन्वेस्ट (Learn2Invest)',
    campusEdition: '3D कैंपस संस्करण',
    rankList: 'रैंक सूची (Rank List)',
    logout: 'लॉग आउट',
    loginTitle: 'छात्र पोर्टल लॉगिन',
    username: 'उपयोगकर्ता नाम',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    chooseAvatar: 'अवतार चुनें और कस्टमाइज़ करें',
    outfitStyle: 'पोशाक थीम',
    selectLevel: 'प्रारंभिक स्तर चुनें',
    beginner: 'शुरुआती (Beginner)',
    intermediate: 'मध्यम (Intermediate)',
    advanced: 'उन्नत (Advanced)',
    locked: 'लॉक है',
    enterCampus: '3D कैंपस में प्रवेश करें →',
    skipWalk: 'चलना छोड़ें (Skip) →',
    fullScreen: 'फुल स्क्रीन (Full Screen)',
    exitFullScreen: 'फुल स्क्रीन से बाहर निकलें',
    arrowKeysHint: 'कहीं भी चलने के लिए एरो कीज़ (↑ ↓ ← →) का उपयोग करें',
    rankListTitle: 'कैंपस टॉप लर्नर्स रैंक सूची',
    rankListSubtitle: 'सभी स्तरों के शीर्ष निवेशकों और छात्रों का लाइव लीडरबोर्ड',
    youTag: 'आप',
    close: 'बंद करें',
  }
}

// Comprehensive phrase & term dictionary for automatic DOM translation across all screens
export const PHRASE_TRANSLATIONS = {
  kn: {
    'Learn2Invest': 'ಲರ್ನ್2ಇನ್ವೆಸ್ಟ್',
    '3D Campus Edition': '3D ಕ್ಯಾಂಪಸ್ ಆವೃತ್ತಿ',
    '1. Login': '1. ಲಾಗಿನ್',
    '2. Room 101': '2. ಕೊಠಡಿ 101',
    '3. Room 102': '3. ಕೊಠಡಿ 102',
    '4. Room 103': '4. ಕೊಠಡಿ 103',
    '5. Room 104': '5. ಕೊಠಡಿ 104',
    '6. Quiz': '6. ರಸಪ್ರಶ್ನೆ (Quiz)',
    '7. L2 Lab': '7. L2 ಕಂಪ್ಯೂಟರ್ ಲ್ಯಾಬ್',
    '8. Veranda': '8. ವರಾಂಡಾ',
    '9. Exit': '9. ನಿರ್ಗಮನ',
    '10. L3 Bank': '10. L3 ಬ್ಯಾಂಕ್',
    '11. Map': '11. ನಕ್ಷೆ',
    'Rank List': 'ಶ್ರೇಣಿ ಪಟ್ಟಿ',
    'Logout': 'ಲಾಗ್ ಔಟ್',
    'Skip Walk →': 'ನಡಿಗೆ ಸ್ಕಿಪ್ ಮಾಡಿ →',
    'PPF Simulator': 'PPF ಸಿಮ್ಯುಲೇಟರ್',
    'Fixed Deposit': 'ಸ್ಥಿರ ಠೇವಣಿ (Fixed Deposit)',
    'NSC Calculator': 'NSC ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    'Sukanya Samriddhi': 'ಸುಕನ್ಯಾ ಸಮೃದ್ಧಿ',
    'Recurring Deposit': 'ಮರುಕಳಿಸುವ ಠೇವಣಿ (RD)',
    'Post Office MIS': 'ಪೋಸ್ಟ್ ಆಫೀಸ್ MIS',
    'Gold Investment': 'ಚಿನ್ನದ ಹೂಡಿಕೆ',
    'Savings Mixer': 'ಉಳಿತಾಯ ಮಿಕ್ಸರ್ (Savings Mixer)',
    'Portfolio Simulation': 'ಪೋರ್ಟ್‌ಫೋಲಿಯೋ ಸಿಮ್ಯುಲೇಶನ್',
    'Educational Notes': 'ಶೈಕ್ಷಣಿಕ ಟಿಪ್ಪಣಿಗಳು',
    'Comparison Metric': 'ಹೋಲಿಕೆ ಮೆಟ್ರಿಕ್',
    'What Should You Know?': 'ನೀವು ಏನು ತಿಳಿದಿರಬೇಕು?',
    'Learning Challenges': 'ಕಲಿಕೆಯ ಸವಾಲುಗಳು',
    'Growth Projector': 'ಬೆಳವಣಿಗೆಯ ಪ್ರೊಜೆಕ್ಟರ್',
    'Multi-Goal Savings Planner': 'ಬಹು-ಗುರಿ ಉಳಿತಾಯ ಯೋಜಕ',
    'Investment Plan: When Can I Buy?': 'ಹೂಡಿಕೆ ಯೋಜನೆ: ನಾನು ಯಾವಾಗ ಖರೀದಿಸಬಹುದು?',
    'Simulation History': 'ಸಿಮ್ಯುಲೇಶನ್ ಇತಿಹಾಸ',
    'Bank Slip Writing': 'ಬ್ಯಾಂಕ್ ಸ್ಲಿಪ್ ಬರವಣಿಗೆ',
    'Digital Banking Safety': 'ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಸುರಕ್ಷತೆ',
    'Cabin 1: Bank Slip Writing': 'ಕ್ಯಾಬಿನ್ 1: ಬ್ಯಾಂಕ್ ಸ್ಲಿಪ್ ಬರವಣಿಗೆ',
    'Cabin 2: Digital Banking Safety': 'ಕ್ಯಾಬಿನ್ 2: ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಸುರಕ್ಷತೆ',
    'Key Takeaways': 'ಮುಖ್ಯ ಕಲಿಕೆಗಳು (Key Takeaways)',
    'Full Screen': 'ಪೂರ್ಣ ಪರದೆ',
    'Exit Full Screen': 'ಪೂರ್ಣ ಪರದೆಯಿಂದ ನಿರ್ಗಮಿಸಿ',
    'Play': 'ಪ್ಲೇ ಮಾಡಿ',
    'Pause': 'ವಿರಾಮ',
    'Replay': 'ಮತ್ತೆ ಪ್ಲೇ ಮಾಡಿ',
    'Complete Lesson': 'ಪಾಠ ಪೂರ್ಣಗೊಳಿಸಿ',
    'Next Classroom →': 'ಮುಂದಿನ ತರಗತಿ →',
    'Proceed to Exam Hall →': 'ಪರೀಕ್ಷಾ ಕೊಠಡಿಗೆ ಮುಂದುವರಿಯಿರಿ →',
    'Submit Answer': 'ಉತ್ತರ ಸಲ್ಲಿಸಿ',
    'Next Question →': 'ಮುಂದಿನ ಪ್ರಶ್ನೆ →',
    'Run Simulation': 'ಸಿಮ್ಯುಲೇಶನ್ ನಡೆಸಿ',
    'Save to History': 'ಇತಿಹಾಸಕ್ಕೆ ಉಳಿಸಿ',
    'Clear History': 'ಇತಿಹಾಸ ಅಳಿಸಿ',
    'Complete Level 2 & Exit →': 'ಹಂತ 2 ಪೂರ್ಣಗೊಳಿಸಿ ಮತ್ತು ನಿರ್ಗಮಿಸಿ →',
    'Next Computer →': 'ಮುಂದಿನ ಕಂಪ್ಯೂಟರ್ →',
    'Annual Investment': 'ವಾರ್ಷಿಕ ಹೂಡಿಕೆ',
    'Monthly Deposit': 'ಮಾಸಿಕ ಠೇವಣಿ',
    'Deposit Amount': 'ಠೇವಣಿ ಮೊತ್ತ',
    'NSC Investment': 'NSC ಹೂಡಿಕೆ',
    'Lump Sum Investment': 'ಒಟ್ಟು ಮೊತ್ತದ ಹೂಡಿಕೆ',
    'Duration': 'ಅವಧಿ',
    'Total Invested': 'ಒಟ್ಟು ಹೂಡಿಕೆ',
    'Interest Earned': 'ಗಳಿಸಿದ ಬಡ್ಡಿ',
    'Maturity Value': 'ಮೆಚ್ಯೂರಿಟಿ ಮೌಲ್ಯ',
    'Monthly Income': 'ಮಾಸಿಕ ಆದಾಯ',
    'Total Return': 'ಒಟ್ಟು ಆದಾಯ',
    'Beginner': 'ಆರಂಭಿಕ (Beginner)',
    'Intermediate': 'ಮಧ್ಯಮ (Intermediate)',
    'Advanced': 'ಮುಂದುವರಿದ (Advanced)',
    'Locked': 'ಲಾಕ್ ಆಗಿದೆ',
    'Read': 'ಓದಿ (Read)',
    'Stop': 'ನಿಲ್ಲಿಸಿ',
    'Send': 'ಕಳುಹಿಸಿ',
    'Voice Output': 'ಧ್ವನಿ ಔಟ್‌ಪುಟ್',
    'Muted': 'ಮ್ಯೂಟ್ ಮಾಡಲಾಗಿದೆ',
    'Verify & Submit Slip': 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸ್ಲಿಪ್ ಸಲ್ಲಿಸಿ',
    'Verify IFSC': 'IFSC ಪರಿಶೀಲಿಸಿ',
    'Search Bank & Branch': 'ಬ್ಯಾಂಕ್ ಮತ್ತು ಶಾಖೆ ಹುಡುಕಿ',
  },
  hi: {
    'Learn2Invest': 'लर्न2इन्वेस्ट',
    '3D Campus Edition': '3D कैंपस संस्करण',
    '1. Login': '1. लॉगिन',
    '2. Room 101': '2. कमरा 101',
    '3. Room 102': '3. कमरा 102',
    '4. Room 103': '4. कमरा 103',
    '5. Room 104': '5. कमरा 104',
    '6. Quiz': '6. क्विज़ (Quiz)',
    '7. L2 Lab': '7. L2 कंप्यूटर लैब',
    '8. Veranda': '8. बरामदा (Veranda)',
    '9. Exit': '9. निकास (Exit)',
    '10. L3 Bank': '10. L3 बैंक',
    '11. Map': '11. मानचित्र (Map)',
    'Rank List': 'रैंक सूची',
    'Logout': 'लॉग आउट',
    'Skip Walk →': 'चलना छोड़ें →',
    'PPF Simulator': 'PPF सिम्युलेटर',
    'Fixed Deposit': 'फिक्स्ड डिपॉज़िट (FD)',
    'NSC Calculator': 'NSC कैलकुलेटर',
    'Sukanya Samriddhi': 'सुकन्या समृद्धि',
    'Recurring Deposit': 'रेकरिंग डिपॉज़िट (RD)',
    'Post Office MIS': 'पोस्ट ऑफिस MIS',
    'Gold Investment': 'स्वर्ण निवेश (Gold)',
    'Savings Mixer': 'सेविंग्स मिक्सर (Savings Mixer)',
    'Portfolio Simulation': 'पोर्टफोलियो सिम्युलेशन',
    'Educational Notes': 'शैक्षिक नोट्स (Educational Notes)',
    'Comparison Metric': 'तुलना मेट्रिक (Comparison Metric)',
    'What Should You Know?': 'आपको क्या जानना चाहिए?',
    'Learning Challenges': 'सीखने की चुनौतियाँ',
    'Growth Projector': 'ग्रोथ प्रोजेक्टर',
    'Multi-Goal Savings Planner': 'मल्टी-गोल सेविंग्स प्लानर',
    'Investment Plan: When Can I Buy?': 'निवेश योजना: मैं कब खरीद सकता हूँ?',
    'Simulation History': 'सिम्युलेशन इतिहास',
    'Bank Slip Writing': 'बैंक स्लिप लेखन',
    'Digital Banking Safety': 'डिजिटल बैंकिंग सुरक्षा',
    'Cabin 1: Bank Slip Writing': 'केबिन 1: बैंक स्लिप लेखन',
    'Cabin 2: Digital Banking Safety': 'केबिन 2: डिजिटल बैंकिंग सुरक्षा',
    'Key Takeaways': 'मुख्य बातें (Key Takeaways)',
    'Full Screen': 'फुल स्क्रीन',
    'Exit Full Screen': 'फुल स्क्रीन से बाहर निकलें',
    'Play': 'चलाएं',
    'Pause': 'रोकें',
    'Replay': 'फिर से चलाएं',
    'Complete Lesson': 'पाठ पूरा करें',
    'Next Classroom →': 'अगली कक्षा →',
    'Proceed to Exam Hall →': 'परीक्षा हॉल में जाएं →',
    'Submit Answer': 'उत्तर सबमिट करें',
    'Next Question →': 'अगला प्रश्न →',
    'Run Simulation': 'सिम्युलेशन चलाएं',
    'Save to History': 'इतिहास में सहेजें',
    'Clear History': 'इतिहास साफ़ करें',
    'Complete Level 2 & Exit →': 'लेवल 2 पूरा करें और बाहर निकलें →',
    'Next Computer →': 'अगला कंप्यूटर →',
    'Annual Investment': 'वार्षिक निवेश',
    'Monthly Deposit': 'मासिक जमा',
    'Deposit Amount': 'जमा राशि',
    'NSC Investment': 'NSC निवेश',
    'Lump Sum Investment': 'एकमुश्त निवेश',
    'Duration': 'अवधि',
    'Total Invested': 'कुल निवेश',
    'Interest Earned': 'अर्जित ब्याज',
    'Maturity Value': 'परिपक्वता मूल्य (Maturity)',
    'Monthly Income': 'मासिक आय',
    'Total Return': 'कुल रिटर्न',
    'Beginner': 'शुरुआती (Beginner)',
    'Intermediate': 'मध्यम (Intermediate)',
    'Advanced': 'उन्नत (Advanced)',
    'Locked': 'लॉक है',
    'Read': 'पढ़ें (Read)',
    'Stop': 'रोकें',
    'Send': 'भेजें',
    'Voice Output': 'वॉइस आउटपुट',
    'Muted': 'म्यूट है',
    'Verify & Submit Slip': 'सत्यापित करें और स्लिप जमा करें',
    'Verify IFSC': 'IFSC सत्यापित करें',
    'Search Bank & Branch': 'बैंक और शाखा खोजें',
  }
}

const WORD_REPLACEMENTS = {
  kn: [
    ['Classroom 101', 'ತರಗತಿ 101'],
    ['Classroom 102', 'ತರಗತಿ 102'],
    ['Classroom 103', 'ತರಗತಿ 103'],
    ['Classroom 104', 'ತರಗತಿ 104'],
    ['Exam Hall', 'ಪರೀಕ್ಷಾ ಕೊಠಡಿ'],
    ['Computer Lab', 'ಕಂಪ್ಯೂಟರ್ ಲ್ಯಾಬ್'],
    ['Computer 1', 'ಕಂಪ್ಯೂಟರ್ 1'],
    ['Computer 2', 'ಕಂಪ್ಯೂಟರ್ 2'],
    ['Computer 3', 'ಕಂಪ್ಯೂಟರ್ 3'],
    ['Simulator Modules', 'ಸಿಮ್ಯುಲೇಟರ್ ಮಾಡ್ಯೂಲ್‌ಗಳು'],
    ['Savings Mixer', 'ಉಳಿತಾಯ ಮಿಕ್ಸರ್'],
    ['Portfolio Simulation', 'ಪೋರ್ಟ್‌ಫೋಲಿಯೋ ಸಿಮ್ಯುಲೇಶನ್'],
    ['PPF Simulator', 'PPF ಸಿಮ್ಯುಲೇಟರ್'],
    ['Fixed Deposit', 'ಸ್ಥಿರ ಠೇವಣಿ (FD)'],
    ['NSC Calculator', 'NSC ಕ್ಯಾಲ್ಕುಲೇಟರ್'],
    ['Sukanya Samriddhi', 'ಸುಕನ್ಯಾ ಸಮೃದ್ಧಿ'],
    ['Recurring Deposit', 'ಮರುಕಳಿಸುವ ಠೇವಣಿ (RD)'],
    ['Post Office MIS', 'ಪೋಸ್ಟ್ ಆಫೀಸ್ MIS'],
    ['Educational Notes', 'ಶೈಕ್ಷಣಿಕ ಟಿಪ್ಪಣಿಗಳು'],
    ['Comparison Metric', 'ಹೋಲಿಕೆ ಮೆಟ್ರಿಕ್'],
    ['What Should You Know', 'ನೀವು ಏನು ತಿಳಿದಿರಬೇಕು'],
    ['Learning Challenges', 'ಕಲಿಕೆಯ ಸವಾಲುಗಳು'],
    ['Growth Projector', 'ಬೆಳವಣಿಗೆಯ ಪ್ರೊಜೆಕ್ಟರ್'],
    ['Multi-Goal Savings Planner', 'ಬಹು-ಗುರಿ ಉಳಿತಾಯ ಯೋಜಕ'],
    ['When Can I Buy', 'ನಾನು ಯಾವಾಗ ಖರೀದಿಸಬಹುದು'],
    ['Bank Slip Writing', 'ಬ್ಯಾಂಕ್ ಸ್ಲಿಪ್ ಬರವಣಿಗೆ'],
    ['Digital Banking Safety', 'ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಸುರಕ್ಷತೆ'],
    ['Key Takeaways', 'ಮುಖ್ಯ ಕಲಿಕೆಗಳು'],
    ['Total Invested', 'ಒಟ್ಟು ಹೂಡಿಕೆ'],
    ['Interest Earned', 'ಗಳಿಸಿದ ಬಡ್ಡಿ'],
    ['Maturity Value', 'ಮೆಚ್ಯೂರಿಟಿ ಮೌಲ್ಯ'],
    ['Monthly Income', 'ಮಾಸಿಕ ಆದಾಯ'],
    ['Tax Benefit', 'ತೆರಿಗೆ ಪ್ರಯೋಜನ'],
    ['Lock-in Period', 'ಲಾಕ್-ಇನ್ ಅವಧಿ'],
    ['Risk Profile', 'ಅಪಾಯದ ಮಟ್ಟ'],
    ['Interest Rate', 'ಬಡ್ಡಿದರ'],
    ['Account Holder Name', 'ಖಾತೆದಾರರ ಹೆಸರು'],
    ['Account Number', 'ಖಾತೆ ಸಂಖ್ಯೆ'],
    ['Branch Name', 'ಶಾಖೆಯ ಹೆಸರು'],
    ['Amount in Words', 'ಅಕ್ಷರಗಳಲ್ಲಿ ಮೊತ್ತ'],
    ['Student Portal', 'ವಿದ್ಯಾರ್ಥಿ ಪೋರ್ಟಲ್'],
    ['Beginner', 'ಆರಂಭಿಕ'],
    ['Intermediate', 'ಮಧ್ಯಮ'],
    ['Advanced', 'ಮುಂದುವರಿದ'],
  ],
  hi: [
    ['Classroom 101', 'कक्षा 101'],
    ['Classroom 102', 'कक्षा 102'],
    ['Classroom 103', 'कक्षा 103'],
    ['Classroom 104', 'कक्षा 104'],
    ['Exam Hall', 'परीक्षा हॉल'],
    ['Computer Lab', 'कंप्यूटर लैब'],
    ['Computer 1', 'कंप्यूटर 1'],
    ['Computer 2', 'कंप्यूटर 2'],
    ['Computer 3', 'कंप्यूटर 3'],
    ['Simulator Modules', 'सिम्युलेटर मॉड्यूल'],
    ['Savings Mixer', 'सेविंग्स मिक्सर'],
    ['Portfolio Simulation', 'पोर्टफोलियो सिम्युलेशन'],
    ['PPF Simulator', 'PPF सिम्युलेटर'],
    ['Fixed Deposit', 'फिक्स्ड डिपॉज़िट (FD)'],
    ['NSC Calculator', 'NSC कैलकुलेटर'],
    ['Sukanya Samriddhi', 'सुकन्या समृद्धि'],
    ['Recurring Deposit', 'रेकरिंग डिपॉज़िट (RD)'],
    ['Post Office MIS', 'पोस्ट ऑफिस MIS'],
    ['Educational Notes', 'शैक्षिक नोट्स'],
    ['Comparison Metric', 'तुलना मेट्रिक'],
    ['What Should You Know', 'आपको क्या जानना चाहिए'],
    ['Learning Challenges', 'सीखने की चुनौतियाँ'],
    ['Growth Projector', 'ग्रोथ प्रोजेक्टर'],
    ['Multi-Goal Savings Planner', 'मल्टी-गोल सेविंग्स प्लानर'],
    ['When Can I Buy', 'मैं कब खरीद सकता हूँ'],
    ['Bank Slip Writing', 'बैंक स्लिप लेखन'],
    ['Digital Banking Safety', 'डिजिटल बैंकिंग सुरक्षा'],
    ['Key Takeaways', 'मुख्य बातें'],
    ['Total Invested', 'कुल निवेश'],
    ['Interest Earned', 'अर्जित ब्याज'],
    ['Maturity Value', 'परिपक्वता मूल्य'],
    ['Monthly Income', 'मासिक आय'],
    ['Tax Benefit', 'कर लाभ'],
    ['Lock-in Period', 'लॉक-इन अवधि'],
    ['Risk Profile', 'जोखिम प्रोफ़ाइल'],
    ['Interest Rate', 'ब्याज दर'],
    ['Account Holder Name', 'खाताधारक का नाम'],
    ['Account Number', 'खाता संख्या'],
    ['Branch Name', 'शाखा का नाम'],
    ['Amount in Words', 'शब्दों में राशि'],
    ['Student Portal', 'छात्र पोर्टल'],
    ['Beginner', 'शुरुआती'],
    ['Intermediate', 'मध्यम'],
    ['Advanced', 'उन्नत'],
  ]
}

export function t(key, lang = 'en') {
  return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS.en[key] || key
}

export function translateTextString(str, lang = 'en') {
  if (!str || lang === 'en') return str
  const trimmed = str.trim()
  if (!trimmed) return str

  const dict = PHRASE_TRANSLATIONS[lang]
  if (dict && dict[trimmed]) {
    return str.replace(trimmed, dict[trimmed])
  }

  let result = str
  const pairs = WORD_REPLACEMENTS[lang] || []
  for (const [enTerm, localTerm] of pairs) {
    if (result.includes(enTerm)) {
      result = result.split(enTerm).join(localTerm)
    }
  }
  return result
}

export function useGlobalDomTranslator(lang = 'en') {
  useEffect(() => {
    if (typeof document === 'undefined') return

    let isApplying = false

    const processNode = (root) => {
      if (!root || isApplying) return
      isApplying = true
      try {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
        let node = walker.nextNode()
        while (node) {
          const parentTag = node.parentElement?.tagName
          if (parentTag !== 'SCRIPT' && parentTag !== 'STYLE' && parentTag !== 'TEXTAREA') {
            const currentVal = node.nodeValue || ''
            if (node.__origText === undefined || (lang === 'en' && currentVal !== node.__lastTranslated)) {
              node.__origText = currentVal
            }
            if (lang === 'en') {
              if (node.__origText !== undefined && node.nodeValue !== node.__origText) {
                node.nodeValue = node.__origText
              }
            } else {
              const baseText = node.__origText !== undefined ? node.__origText : currentVal
              const translated = translateTextString(baseText, lang)
              if (translated !== currentVal) {
                node.__lastTranslated = translated
                node.nodeValue = translated
              }
            }
          }
          node = walker.nextNode()
        }
      } finally {
        isApplying = false
      }
    }

    processNode(document.body)

    const observer = new MutationObserver(() => {
      processNode(document.body)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [lang])
}
