<template>
  <div class="auth-layout">
    <div class="auth-layout__panel card">
      <div class="auth-layout__intro">
        <span>CommunityHub</span>
        <h1>Gestioná tu comunidad desde una sola plataforma.</h1>
        <p>
          Eventos, notificaciones, categorias, usuarios y modo offline conectados al backend del
          proyecto final.
        </p>
      </div>
      <slot />
    </div>
    <AppToastList />
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;

  &__panel {
    width: min(1080px, 100%);
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  &__intro {
    padding: 2.2rem;
    color: #fff;
    background:
      linear-gradient(135deg, rgba(15, 118, 110, 0.9), rgba(8, 47, 73, 0.86)),
      radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 28%);

    span {
      display: inline-flex;
      padding: 0.45rem 0.8rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.14);
      margin-bottom: 1rem;
    }

    h1 {
      margin: 0 0 1rem;
      font-family: var(--font-display);
      font-size: clamp(2.2rem, 4vw, 3.6rem);
    }

    p {
      margin: 0;
      max-width: 40ch;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

@media (max-width: 860px) {
  .auth-layout__panel {
    grid-template-columns: 1fr;
  }
}
</style>
