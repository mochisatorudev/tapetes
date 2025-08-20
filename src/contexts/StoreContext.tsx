import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, StoreSettings, isSupabaseConfigured } from '../lib/supabase';

// Função para aplicar o tema e configurações visuais
function applyThemeSettings(settings: StoreSettings) {
  const root = document.documentElement;
  // Aplicar cores personalizadas
  root.style.setProperty('--primary-color', settings.primary_color);
  root.style.setProperty('--secondary-color', settings.secondary_color);
  root.style.setProperty('--accent-color', settings.accent_color);
  root.style.setProperty('--background-color', settings.background_color);
  root.style.setProperty('--text-color', settings.text_color);
  // Aplicar cores de botões
  root.style.setProperty('--button-primary-bg', settings.button_primary_bg_color);
  root.style.setProperty('--button-primary-text', settings.button_primary_text_color);
  root.style.setProperty('--button-primary-hover-bg', settings.button_primary_hover_bg_color);
  root.style.setProperty('--button-primary-hover-text', settings.button_primary_hover_text_color);
  root.style.setProperty('--button-secondary-bg', settings.button_secondary_bg_color);
  root.style.setProperty('--button-secondary-text', settings.button_secondary_text_color);
  root.style.setProperty('--button-secondary-hover-bg', settings.button_secondary_hover_bg_color);
  root.style.setProperty('--button-secondary-hover-text', settings.button_secondary_hover_text_color);
  root.style.setProperty('--button-success-bg', settings.button_success_bg_color);
  root.style.setProperty('--button-success-text', settings.button_success_text_color);
  root.style.setProperty('--button-success-hover-bg', settings.button_success_hover_bg_color);
  root.style.setProperty('--button-success-hover-text', settings.button_success_hover_text_color);
  root.style.setProperty('--button-danger-bg', settings.button_danger_bg_color);
  root.style.setProperty('--button-danger-text', settings.button_danger_text_color);
  root.style.setProperty('--button-danger-hover-bg', settings.button_danger_hover_bg_color);
  root.style.setProperty('--button-danger-hover-text', settings.button_danger_hover_text_color);
  // Aplicar cores de textos específicos
  root.style.setProperty('--product-title-color', settings.product_title_color);
  root.style.setProperty('--product-description-color', settings.product_description_color);
  root.style.setProperty('--product-price-color', settings.product_price_color);
  root.style.setProperty('--header-text-color', settings.header_text_color);
  root.style.setProperty('--footer-text-color', settings.footer_text_color);
  root.style.setProperty('--link-color', settings.link_color);
  root.style.setProperty('--link-hover-color', settings.link_hover_color);
  // Aplicar cores de ícones
  root.style.setProperty('--cart-icon-color', settings.cart_icon_color);
  root.style.setProperty('--star-icon-color', settings.star_icon_color);
  root.style.setProperty('--search-icon-color', settings.search_icon_color);
  root.style.setProperty('--menu-icon-color', settings.menu_icon_color);
  root.style.setProperty('--social-icon-color', settings.social_icon_color);
  root.style.setProperty('--social-icon-hover-color', settings.social_icon_hover_color);
  // Aplicar efeitos visuais
  root.style.setProperty('--card-shadow', `0 4px 6px -1px ${settings.card_shadow_color}`);
  root.style.setProperty('--card-shadow-hover', `0 10px 15px -3px ${settings.card_shadow_hover_color}`);
  root.style.setProperty('--card-border-radius', settings.card_border_radius);
  root.style.setProperty('--button-border-radius', settings.button_border_radius);
  root.style.setProperty('--input-border-radius', settings.input_border_radius);
  // Aplicar cores de bordas
  root.style.setProperty('--card-border-color', settings.card_border_color);
  root.style.setProperty('--input-border-color', settings.input_border_color);
  root.style.setProperty('--input-focus-border-color', settings.input_focus_border_color);
  root.style.setProperty('--button-border-color', settings.button_border_color);
  // Aplicar cores de fundo específicas
  root.style.setProperty('--card-background-color', settings.card_background_color);
  root.style.setProperty('--input-background-color', settings.input_background_color);
  root.style.setProperty('--header-background-color', settings.header_background_color);
  root.style.setProperty('--footer-background-color', settings.footer_background_color);
  root.style.setProperty('--sidebar-background-color', settings.sidebar_background_color);
  // Aplicar tipografia específica
  root.style.setProperty('--product-title-font-size', settings.product_title_font_size);
  root.style.setProperty('--product-title-font-weight', settings.product_title_font_weight);
  root.style.setProperty('--product-description-font-size', settings.product_description_font_size);
  root.style.setProperty('--product-description-font-weight', settings.product_description_font_weight);
  root.style.setProperty('--product-price-font-size', settings.product_price_font_size);
  root.style.setProperty('--product-price-font-weight', settings.product_price_font_weight);
  root.style.setProperty('--button-font-size', settings.button_font_size);
  root.style.setProperty('--button-font-weight', settings.button_font_weight);
  // Aplicar espaçamentos
  root.style.setProperty('--card-padding', settings.card_padding);
  // Aplicar configurações adicionais
  root.style.setProperty('--button-padding-x', settings.button_padding_x);
  root.style.setProperty('--button-padding-y', settings.button_padding_y);
  root.style.setProperty('--section-margin-y', settings.section_margin_y);
  // Aplicar animações
  root.style.setProperty('--hover-transition-duration', settings.hover_transition_duration);
  root.style.setProperty('--button-hover-scale', settings.button_hover_scale);
  root.style.setProperty('--card-hover-scale', settings.card_hover_scale);
  // Aplicar cores de status
  root.style.setProperty('--success-color', settings.success_color);
  root.style.setProperty('--warning-color', settings.warning_color);
  root.style.setProperty('--error-color', settings.error_color);
  root.style.setProperty('--info-color', settings.info_color);
  // Aplicar cores de navegação
  root.style.setProperty('--nav-link-color', settings.nav_link_color);
  root.style.setProperty('--nav-link-hover-color', settings.nav_link_hover_color);
  root.style.setProperty('--nav-link-active-color', settings.nav_link_active_color);
  root.style.setProperty('--breadcrumb-color', settings.breadcrumb_color);
  root.style.setProperty('--breadcrumb-separator-color', settings.breadcrumb_separator_color);
  // Aplicar fontes
  root.style.setProperty('--font-family', settings.font_family);
  root.style.setProperty('--heading-font', settings.heading_font);
  // Atualizar favicon se configurado
  if (settings.favicon_url) {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = settings.favicon_url;
    }
  }
  // Aplicar modo escuro se habilitado
  if (settings.enable_dark_mode) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
};

// (interface StoreSettings removida, usar apenas o tipo importado de supabase.ts)

interface StoreContextType {
  settings: StoreSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}


const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase!
      .from('store_settings')
      .select('*')
      .single();
    if (!error && data) {
      setSettings(data as StoreSettings);
      applyThemeSettings(data as StoreSettings);
    }
    setLoading(false);
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();

    if (isSupabaseConfigured()) {
      const subscription = supabase!
        .channel('store_settings_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, fetchSettings)
        .subscribe();
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);



  const value = {
    settings,
    loading,
    refreshSettings,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};