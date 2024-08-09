// // components/donations/popup/request-button-wrapper.tsx
// 'use client'
//
// import RequestButton from './request-button'
// import { useState } from 'react'
//
// export default function RequestButtonWrapper({ donation, isLoggedIn }) {
//     const [showLoginPrompt, setShowLoginPrompt] = useState(false)
//
//     if (!isLoggedIn) {
//         return (
//             <>
//                 <button
//                     className="bg-black text-white px-4 py-2 rounded-lg"
//                     onClick={() => setShowLoginPrompt(true)}
//                 >
//                     Send Request
//                 </button>
//                 {showLoginPrompt && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                         <div className="bg-white p-8 rounded-lg">
//                             <h2 className="text-xl font-bold mb-4">Please log in to send a request</h2>
//                             <a href="/login" className="bg-black text-white px-4 py-2 rounded-lg">Log In</a>
//                         </div>
//                     </div>
//                 )}
//             </>
//         )
//     }
//
//     return <RequestButton donation={donation} />
// y