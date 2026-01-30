import { Phone, Mail } from 'lucide-react'
import React from 'react'

export default function Footer() {
    return (
        <div className="bg-white text-indigo-600 py-4 text-center bottom-0 w-full border mt-auto">
            {/* <div className='flex items-center justify-around mb-2 w-full'>
                <div className='flex gap-2 items-center'>
                    <Phone size={16} />
                    011 42603232
                </div>
                <div className='flex gap-2 items-center'>
                    <Mail size={16} />
                    info@promozionebranding.com
                </div>
            </div> */}
            <p>© 2025 Promozione Branding HRM. All rights reserved.</p>
        </div>
    )
}
