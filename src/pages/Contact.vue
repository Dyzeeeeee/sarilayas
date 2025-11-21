<template>
  <PublicLayout>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Contact Information -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            <div v-if="loading" class="space-y-4">
              <div class="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              <div class="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              <div class="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            <div v-else class="space-y-6">
              <!-- Email -->
              <div v-if="contactInfo.email" class="flex items-start gap-4">
                <div class="bg-primary-100 rounded-lg p-3 flex-shrink-0">
                  <Mail class="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Email</h3>
                  <a :href="`mailto:${contactInfo.email}`" class="text-primary-600 hover:text-primary-700 transition-colors">
                    {{ contactInfo.email }}
                  </a>
                </div>
              </div>

              <!-- Phone -->
              <div v-if="contactInfo.phone" class="flex items-start gap-4">
                <div class="bg-primary-100 rounded-lg p-3 flex-shrink-0">
                  <Phone class="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Phone</h3>
                  <a :href="`tel:${contactInfo.phone}`" class="text-primary-600 hover:text-primary-700 transition-colors">
                    {{ contactInfo.phone }}
                  </a>
                </div>
              </div>

              <!-- Address -->
              <div v-if="contactInfo.address" class="flex items-start gap-4">
                <div class="bg-primary-100 rounded-lg p-3 flex-shrink-0">
                  <MapPin class="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Address</h3>
                  <p class="text-gray-600 leading-relaxed">{{ contactInfo.address }}</p>
                </div>
              </div>

              <!-- Social Media -->
              <div class="pt-4 border-t border-gray-200">
                <h3 class="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div class="flex gap-4">
                  <a
                    v-if="contactInfo.facebook"
                    :href="contactInfo.facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="bg-primary-100 hover:bg-primary-200 rounded-lg p-3 transition-colors"
                  >
                    <Facebook class="w-6 h-6 text-primary-600" />
                  </a>
                  <a
                    v-if="contactInfo.youtube"
                    :href="contactInfo.youtube"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="bg-primary-100 hover:bg-primary-200 rounded-lg p-3 transition-colors"
                  >
                    <Youtube class="w-6 h-6 text-primary-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Your name"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="your.email@example.com"
              />
            </div>

            <!-- Subject -->
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="What is this regarding?"
              />
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                placeholder="Your message here..."
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send v-if="!submitting" class="w-5 h-5" />
              <span v-if="submitting">Sending...</span>
              <span v-else>Send Message</span>
            </button>

            <!-- Success Message -->
            <div v-if="submitted" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              Thank you for your message! We'll get back to you soon.
            </div>
          </form>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PublicLayout from '../layouts/PublicLayout.vue'
import { contactService } from '../firebase/firestore'
import { Mail, Phone, MapPin, Facebook, Youtube, Send } from 'lucide-vue-next'
import emailjs from '@emailjs/browser'

// Initialize EmailJS
if (import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)
}

const loading = ref(true)
const submitting = ref(false)
const submitted = ref(false)
const contactInfo = ref({
  email: '',
  phone: '',
  address: '',
  facebook: '',
  youtube: ''
})

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

async function loadContactInfo() {
  loading.value = true
  try {
    const data = await contactService.getContact()
    if (data) {
      contactInfo.value = {
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        facebook: data.facebook || '',
        youtube: data.youtube || ''
      }
    }
  } catch (error) {
    console.error('Error loading contact info:', error)
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  submitting.value = true
  submitted.value = false
  
  try {
    // Store message in Firestore
    await contactService.submitMessage({
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message
    })

    // Send email notification using EmailJS
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id',
        {
          to_email: 'jdmalaluan2@gmail.com',
          from_name: form.value.name,
          from_email: form.value.email,
          subject: form.value.subject,
          message: form.value.message,
          reply_to: form.value.email
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key'
      )
    } catch (emailError) {
      console.warn('Email notification failed, but message was saved:', emailError)
      // Don't fail the whole submission if email fails
    }
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    
    submitted.value = true
    setTimeout(() => {
      submitted.value = false
    }, 5000)
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadContactInfo()
})
</script>
