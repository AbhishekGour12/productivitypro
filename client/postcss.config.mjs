export default {
  plugins: {
    "@tailwindcss/postcss": {
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: "#6D28D9",
              light: "#8B5CF6",
              dark: "#5B21B6",
            },
            background: "#F8F9FA",
            card: "#FFFFFF",
            "text-primary": "#1F2937",
            "text-secondary": "#6B7280",
            success: "#10B981",
            danger: "#EF4444",
            warning: "#F59E0B",
          },
        },
      },
    },
  },
}
