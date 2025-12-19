export function ERPFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 text-sm text-muted-foreground">
        <span>Vila Bella ERP</span>
        <a
          href="https://mtsferreira.dev"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Desenvolvido por MtsFerreira
        </a>
      </div>
    </footer>
  );
}
