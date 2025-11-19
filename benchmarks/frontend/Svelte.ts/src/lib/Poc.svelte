<script lang="ts">
  import { onMount } from 'svelte';

  let count = 0;
  let weather: any = null;
  let loading = false;
  let error = '';

  const incrementCount = () => {
    count++;
  };

  const fetchWeather = async () => {
    loading = true;
    error = '';
    try {
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia/Seoul'
      );
      const data = await response.json();
      weather = data;
    } catch (err) {
      error = 'Erreur lors de la récupération de la météo';
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    fetchWeather();
  });
</script>

<div class="container">
  <header class="top-bar">
    <h1>AREA</h1>
    <img src="/src/assets/svelte.svg" alt="Logo AREA" />
  </header>

  <main class="main-content">
    <div class="cards-container">
      <div class="card">
        <h2>Nombre de clique</h2>
        <p class="count-display">{count}</p>
      </div>
      <div class="weather-card">
        <h2>Météo à Séoul</h2>
        {#if loading}
          <div class="loading">Chargement...</div>
        {:else if error}
          <div class="error">{error}</div>
        {:else if weather}
          <div class="weather-info">
            <p class="temperature">{weather.current.temperature_2m}°C</p>
          </div>
        {/if}
      </div>
    </div>
    <button class="add-button" on:click={incrementCount}>Ajouter</button>
  </main>
</div>

<style>
  .container {
    width: 100vw;
    min-height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
  }

  .top-bar {
    background-color: #2c3e50;
    color: white;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .top-bar h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .top-bar img {
    height: 2rem;
    width: auto;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    padding: 2rem;
    width: 100%;
  }

  .cards-container {
    display: flex;
    gap: 2rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .card {
    background-color: white;
    border-radius: 8px;
    padding: 2rem 3rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    min-width: 300px;
  }

  .card h2 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
    font-size: 1.25rem;
  }

  .count-display {
    font-size: 3rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
  }

  .add-button {
    background-color: #2c3e50;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-weight: 500;
  }

  .add-button:hover {
    background-color: #38597a;
  }

  .add-button:active {
    transform: scale(0.98);
  }

  .weather-card {
    background-color: white;
    border-radius: 8px;
    padding: 2rem 3rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    min-width: 300px;
  }

  .weather-card h2 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
    font-size: 1.25rem;
  }

  .weather-info {
    color: #2c3e50;
  }

  .temperature {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
    color: #2c3e50;
  }

  .wind {
    font-size: 1rem;
    margin: 0.5rem 0;
    color: #666;
  }

  .loading, .error {
    padding: 1rem;
    color: #666;
  }

  .error {
    color: #e74c3c;
  }
</style>
