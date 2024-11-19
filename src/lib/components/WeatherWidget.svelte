<script>
    export let latitude;
    export let longitude;
    
    let weather = null;
    let error = null;

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    async function fetchWeather() {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`
            // const response = await fetch(url);
            // if (!response.ok) throw new Error('Weather data not available');
            // weather = await response.json();
        } catch (e) {
            error = e.message;
        }
    }

    $: if (latitude && longitude) {
        fetchWeather();
    }
</script>

{#if weather}
    <div class="space-y-2">
        <h2 class="font-semibold text-lg mb-2">Current Weather</h2>
        <div class="grid grid-cols-3 gap-2">
            <div class="flex items-center gap-2">
                <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Temp</span>
                    <span class="font-medium">{Math.round(weather.main.temp)}°F</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Wind</span>
                    <span class="font-medium">{Math.round(weather.wind.speed)} mph</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Precip</span>
                    <span class="font-medium">
                        {weather.rain ? `${weather.rain['1h']}mm` : '0mm'}
                    </span>
                </div>
            </div>
        </div>
    </div>
{:else if error}
    <div class="text-error text-sm">
        {error}
    </div>
{:else}
    <div class="text-center text-sm animate-pulse">
        Loading weather...
    </div>
{/if}