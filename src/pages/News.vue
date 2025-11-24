<template>
  <PublicLayout>
    <div class="flex flex-col max-w-6xl mx-auto px-2 sm:px-4 min-h-[calc(100vh-80px)]">


      <!-- CONTENT -->
      <div class="flex-1 overflow-y-auto min-h-0">
        <!-- HEADLINE ARTICLE -->
        <div v-if="!loading && headlineArticle" class="px-4 pt-4 pb-4">
          <div
            class="relative w-full rounded-lg overflow-visible cursor-pointer bg-gray-100 group shadow-lg"
            @click="openArticle(headlineArticle)"
          >
            <div class="relative aspect-video sm:aspect-[21/9] overflow-hidden rounded-lg">
              <img
                :src="headlineArticle.image"
                :alt="headlineArticle.title || 'Headline Image'"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
              <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white overflow-visible">
                <div class="mb-2 overflow-visible flex items-center gap-3 flex-wrap">
                  <span class="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full uppercase tracking-wide drop-shadow-lg whitespace-nowrap">
                    Latest News
                  </span>
                  <span v-if="headlineArticle.publishDate" class="text-sm sm:text-base text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] font-semibold">
                    {{ formatDate(headlineArticle.publishDate) }}
                  </span>
                </div>
                <h2 class="text-2xl sm:text-4xl font-extrabold mb-3 line-clamp-3 text-primary-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {{ headlineArticle.title || 'Untitled Article' }}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <!-- HEADLINE LOADING SKELETON -->
        <div v-if="loading" class="px-4 pt-4 pb-4">
          <div class="w-full aspect-video sm:aspect-[21/9] bg-gray-200 rounded-lg animate-pulse shadow-lg"></div>
        </div>

        <!-- REMAINING ARTICLES -->
        <div :class="[
          'gap-3 sm:gap-4 pb-4 p-4',
          !loading && (viewMode === 'list' ? 'flex flex-col' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr')
        ]">
          <!-- Loading state -->
          <template v-if="loading">
            <Skeleton
              v-for="n in 5"
              :key="n"
              type="card"
              variant="default"
              :image-aspect="viewMode === 'list' ? undefined : 'square'"
              :image-height="viewMode === 'list' ? 'h-20 w-20' : undefined"
              :description-lines="viewMode === 'list' ? 1 : 3"
              :card-classes="viewMode === 'list' ? 'flex-row' : 'h-full'"
            />
          </template>

          <!-- Articles -->
          <template v-else>
            <Card
              v-for="article in remainingArticles"
              :key="article.id"
              variant="light"
              :image="article.image"
              image-alt="News Image"
              :title="article.title || 'Untitled Article'"
              :title-clamp="2"
              :description="article.description || 'No description'"
              :description-clamp="viewMode === 'list' ? undefined : '3'"
              :card-classes="viewMode === 'list' ? 'flex-row' : 'h-full'"
              clickable
              @click="openArticle(article)"
            >
              <template v-if="viewMode === 'list'" #image>
                <div class="relative w-20 h-20 shrink-0 overflow-hidden rounded-l-lg bg-gray-100">
                  <img
                    :src="article.image"
                    :alt="article.title || 'News Image'"
                    class="w-full h-full object-cover"
                  />
                </div>
              </template>
              <template v-if="article.publishDate" #footer>
                <p class="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar class="w-3 h-3" />
                  <span class="font-medium">{{ formatDate(article.publishDate) }}</span>
                </p>
              </template>
            </Card>
          </template>

          <!-- Empty state -->
          <p v-if="!loading && remainingArticles.length === 0 && !headlineArticle" :class="viewMode === 'list' ? 'text-center text-gray-400 py-4' : 'text-center text-gray-400 col-span-full py-4'">
            No news articles available.
          </p>
        </div>
      </div>


    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import PublicLayout from "../layouts/PublicLayout.vue";
import Card from "../components/Card.vue";
import Skeleton from "../components/Skeleton.vue";
import { Calendar } from "lucide-vue-next";
import { newsService } from "../firebase/firestore";
import { useViewMode } from "../composables/useViewMode";

const router = useRouter();
const route = useRoute();

// Use the composable for view mode
const { viewMode } = useViewMode('news');

const articles = ref([]);
const loading = ref(true);

// Sort articles by date (newest first)
const sortedArticles = computed(() => {
  return [...articles.value].sort((a, b) => {
    const dateA = a.publishDate ? new Date(a.publishDate) : (a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0));
    const dateB = b.publishDate ? new Date(b.publishDate) : (b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0));
    return dateB - dateA;
  });
});

// Get the newest article as headline
const headlineArticle = computed(() => {
  return sortedArticles.value.length > 0 ? sortedArticles.value[0] : null;
});

// Get remaining articles (excluding headline)
const remainingArticles = computed(() => {
  return sortedArticles.value.slice(1);
});

function openArticle(article) {
  router.push(`/news/${article.id}`);
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

let unsubscribeNews = null

const loadArticles = async () => {
  loading.value = true
  let initialLoadComplete = false
  
  try {
    // Set up real-time listener with pagination (20 items)
    unsubscribeNews = newsService.subscribeToNews((news) => {
      articles.value = news
      if (!initialLoadComplete) {
        initialLoadComplete = true
        loading.value = false
      }
    }, 20)
  } catch (err) {
    console.error("Error setting up news subscription:", err);
    loading.value = false
  }
}

onMounted(() => {
  loadArticles()
})

onUnmounted(() => {
  if (unsubscribeNews) {
    unsubscribeNews()
  }
})
</script>
