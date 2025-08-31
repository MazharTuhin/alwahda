document.getElementById('memberApplicationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `
        <svg class="animate-spin w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        জমা দেওয়া হচ্ছে...
    `;
    submitBtn.disabled = true;

    // Collect form data including file
    const formData = new FormData(e.target);
    formData.append('form-name', 'member-application');
    formData.append('submissionTime', new Date().toLocaleString('bn-BD'));
    
    try {
        // Send to Netlify Forms
        const response = await fetch('https://getform.io/f/allqqlna', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // Show success message with animation
            document.getElementById('memberApplicationForm').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('memberApplicationForm').style.display = 'none';
                document.getElementById('successMessage').classList.remove('hidden');
                document.getElementById('successMessage').style.opacity = '0';
                document.getElementById('successMessage').style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    document.getElementById('successMessage').style.opacity = '1';
                    document.getElementById('successMessage').style.transform = 'translateY(0)';
                    document.getElementById('successMessage').style.transition = 'all 0.5s ease-out';
                }, 100);
                
                // Scroll to success message
                document.getElementById('successMessage').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }, 300);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error:', error);
        
        // Fallback: Create email content
        const data = {};
        for (let [key, value] of formData.entries()) {
            if (key !== 'profilePhoto') {
                data[key] = value;
            }
        }
        
        const emailBody = `
নতুন সদস্য আবেদন

ব্যক্তিগত তথ্য:
- নাম (বাংলা): ${data.fullNameBn || 'N/A'}
- নাম (English): ${data.fullNameEn || 'N/A'}
- পিতার নাম: ${data.fatherName || 'N/A'}
- মাতার নাম: ${data.motherName || 'N/A'}
- জন্ম তারিখ: ${data.dateOfBirth || 'N/A'}
- NID: ${data.nidNumber || 'N/A'}
- পাসপোর্ট: ${data.passportNumber || 'N/A'}

যোগাযোগ:
- মোবাইল (BD): ${data.phoneBd || 'N/A'}
- মোবাইল (বিদেশ): ${data.phoneAbroad || 'N/A'}
- ইমেইল: ${data.email || 'N/A'}
- স্থায়ী ঠিকানা: ${data.permanentAddress || 'N/A'}
- বর্তমান ঠিকানা: ${data.currentAddress || 'N/A'}

পেশাগত তথ্য:
- পেশা: ${data.currentProfession || 'N/A'}
- কোম্পানি: ${data.companyName || 'N/A'}
- মাসিক আয়: ${data.monthlyIncome || 'N/A'}
- শিক্ষা: ${data.education || 'N/A'}

ব্যবসায়িক আগ্রহ:
- আগ্রহের ক্ষেত্র: ${data.businessInterest || 'N/A'}
- বিনিয়োগ ক্ষমতা: ${data.shareNumber || 'N/A'}
- যোগদানের কারণ: ${data.reasonToJoin || 'N/A'}

নমিনি:
- নাম: ${data.nomineeName || 'N/A'}
- NID: ${data.nomineeName || 'N/A'}
- ফোন: ${data.nomineePhone || 'N/A'}
- সম্পর্ক: ${data.nomineeRelation || 'N/A'}

জমা দেওয়ার সময়: ${data.submissionTime}

দ্রষ্টব্য: সদস্যের ছবি ও সিগনেচার সংযুক্ত রয়েছে।
        `.trim();
        
        const subject = `নতুন সদস্য আবেদন - ${data.fullNameBn || data.fullNameEn}`;
        const mailtoLink = `mailto:mazharulislam0565@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open email client
        window.open(mailtoLink, '_blank');
        
        // Show success message anyway
        document.getElementById('memberApplicationForm').style.display = 'none';
        document.getElementById('successMessage').classList.remove('hidden');
        
        // Show additional instruction for file attachments
        const successMsg = document.getElementById('successMessage');
        successMsg.innerHTML += `
            <div class="mt-6 p-6 bg-brand-primary/20 rounded-2xl border border-brand-primary/30">
                <p class="text-sm text-gray-200">
                    📎 <strong class="text-brand-gold">দ্রষ্টব্য:</strong> সদস্যের ছবি ও সিগনেচার ম্যানুয়ালি ইমেইলে সংযুক্ত করে পাঠান
                </p>
            </div>
        `;
    }
    
    // Reset button
    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
});

// Photo upload handler (only for profile photo now)
function handleProfilePhotoUpload() {
    const profileInput = document.getElementById('profilePhoto');
    const profilePreview = document.getElementById('profilePhotoPreview');
    const profileImg = document.getElementById('profilePhotoImg');
    const profilePlaceholder = document.getElementById('profilePhotoPlaceholder');
    
    profileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                alert('ফাইল সাইজ খুব বড়! সর্বোচ্চ ২MB হতে পারে।');
                profileInput.value = '';
                return;
            }
            
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert('শুধুমাত্র JPG, PNG ফরম্যাট গ্রহণযোগ্য!');
                profileInput.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImg.src = e.target.result;
                profilePreview.classList.remove('hidden');
                profilePlaceholder.style.display = 'none';
                
                // Add success border
                profileInput.parentElement.classList.add('border-brand-primary');
            };
            reader.readAsDataURL(file);
        } else {
            profilePreview.classList.add('hidden');
            profilePlaceholder.style.display = 'flex';
            profileInput.parentElement.classList.remove('border-brand-primary');
        }
    });
}

function handleSignaturePhotoUpload() {
    const signatureInput = document.getElementById('signaturePhoto');
    const signaturePreview = document.getElementById('signaturePhotoPreview');
    const signatureImg = document.getElementById('signaturePhotoImg');
    const signaturePlaceholder = document.getElementById('signaturePhotoPlaceholder');
    
    signatureInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (150 KB max)
            if (file.size > 150 * 1024) {
                alert('ফাইল সাইজ খুব বড়! সর্বোচ্চ 150 KB হতে পারে।');
                signatureInput.value = '';
                return;
            }
            
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert('শুধুমাত্র JPG, PNG ফরম্যাট গ্রহণযোগ্য!');
                signatureInput.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                signatureImg.src = e.target.result;
                signaturePreview.classList.remove('hidden');
                signaturePlaceholder.style.display = 'none';
                
                // Add success border
                signatureInput.parentElement.classList.add('border-brand-primary');
            };
            reader.readAsDataURL(file);
        } else {
            signaturePreview.classList.add('hidden');
            signaturePlaceholder.style.display = 'flex';
            signatureInput.parentElement.classList.remove('border-brand-primary');
        }
    });
}

// Initialize photo upload handler
handleProfilePhotoUpload();
handleSignaturePhotoUpload();

// Form validation with brand colors
const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
inputs.forEach(input => {
    input.addEventListener('invalid', function() {
        this.classList.remove('border-green-500');
        this.classList.add('border-red-400');
    });
    
    input.addEventListener('input', function() {
        if (this.validity.valid) {
            this.classList.remove('border-red-400');
            this.classList.add('border-green-500');
        } else {
            this.classList.add('border-red-400');
            this.classList.remove('border-green-500');
        }
    });
});