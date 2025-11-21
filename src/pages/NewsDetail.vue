<template>
  <PublicLayout>
    <div class="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div class="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        <div class="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
        </div>
      </div>

      <!-- Article Content -->
      <article v-else-if="article">
        <!-- Header -->
        <header class="mb-6">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {{ article.title || 'Untitled Article' }}
          </h1>
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span v-if="article.publishDate" class="flex items-center gap-1">
              <Calendar class="w-4 h-4" />
              <span class="font-medium">{{ formatDate(article.publishDate) }}</span>
            </span>
          </div>
        </header>

        <!-- Featured Image -->
        <div v-if="article.image" class="mb-6 rounded-lg overflow-hidden">
          <img
            :src="article.image"
            :alt="article.title || 'Article image'"
            class="w-full h-auto object-cover"
          />
        </div>

        <!-- Description -->
        <div v-if="article.description" class="prose prose-lg max-w-none mb-6">
          <p class="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
            {{ article.description }}
          </p>
        </div>

        <!-- Content (if available) -->
        <div v-if="article.content" class="prose prose-lg max-w-none">
          <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {{ article.content }}
          </div>
        </div>

        <!-- Back Button -->
        <div class="mt-8">
          <router-link
            to="/news"
            class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to News
          </router-link>
        </div>
      </article>

      <!-- Other News Articles -->
      <div v-if="!loading && otherArticles.length > 0" class="mt-12">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
          Other News
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            v-for="otherArticle in otherArticles"
            :key="otherArticle.id"
            variant="light"
            :image="otherArticle.image"
            image-alt="News Image"
            :title="otherArticle.title || 'Untitled Article'"
            :title-clamp="2"
            :description="otherArticle.description || 'No description'"
            :description-clamp="3"
            card-classes="h-full"
            clickable
            @click="openArticle(otherArticle)"
          >
            <template v-if="otherArticle.publishDate" #footer>
              <p class="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Calendar class="w-3 h-3" />
                <span class="font-medium">{{ formatDate(otherArticle.publishDate) }}</span>
              </p>
            </template>
          </Card>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
        <p class="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
        <router-link
          to="/news"
          class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to News
        </router-link>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PublicLayout from '../layouts/PublicLayout.vue'
import Card from '../components/Card.vue'
import { Calendar } from 'lucide-vue-next'
import { newsService } from '../firebase/firestore'

const route = useRoute()
const router = useRouter()
const article = ref(null)
const allArticles = ref([])
const loading = ref(true)

// Get other articles (excluding current one)
const otherArticles = computed(() => {
  if (!article.value) return []
  return allArticles.value
    .filter(a => a.id !== article.value.id)
    .slice(0, 6) // Show up to 6 other articles
})

function openArticle(article) {
  router.push(`/news/${article.id}`)
}

// Format date for display with relative time
function formatDate(date) {
  if (!date) return '';
  
  // Handle Firestore Timestamp
  let dateObj;
  if (date.toDate) {
    dateObj = date.toDate();
  } else if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    return '';
  }
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  // Show relative time for recent dates
  if (diffSeconds < 60) {
    return diffSeconds <= 1 ? 'just now' : `${diffSeconds} seconds ago`;
  } else if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } else if (diffWeeks < 4) {
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
  } else if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
  } else if (diffYears < 2) {
    return '1 year ago';
  }
  
  // For older dates, show full date and time
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  return dateObj.toLocaleString('en-US', options);
}

onMounted(async () => {
  const articleId = route.params.id
  if (!articleId) {
    router.push('/news')
    return
  }

  try {
    loading.value = true
    allArticles.value = await newsService.getNews()
    article.value = allArticles.value.find(a => a.id === articleId) || null
  } catch (err) {
    console.error('Error fetching article:', err)
  } finally {
    loading.value = false
  }
})
</script>

