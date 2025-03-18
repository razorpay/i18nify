import {
  ActionList,
  ActionListItem,
  BladeProvider,
  Box,
  Button,
  Dropdown,
  DropdownOverlay,
  MenuIcon,
  SelectInput,
} from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import { useI18nContext } from '@razorpay/i18nify-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from 'src/hooks/useMobile';
import { NAV_ITEMS_MAP } from 'src/components/Dashboard/Sidebar/navItems';

import { LANGS } from 'src/constants/locale';
import { LANGUAGES } from 'src/context/constants';
import { useLanguageContext } from 'src/context/languagesContext';

const Header = ({ toggleMobileNav }) => {
  const { selectedLanguage, setSelectedLanguage, setLoading, setSidebarItems } =
    useLanguageContext();
  const { setI18nState, i18nState } = useI18nContext();
  const navigate = useNavigate();

  const isMobile = useMobile();

  useEffect(() => {
    if (i18nState.locale.length === 0) {
      setI18nState({ locale: 'en-IN' });
    }
  }, [i18nState, setI18nState]);

  const handleLoader = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="start"
      padding="spacing.3"
      position="sticky"
      flexWrap="wrap"
      top="spacing.0"
      rowGap="spacing.3"
      borderBottomWidth="thicker"
      backgroundColor="surface.background.gray.subtle"
      borderBottomColor="surface.border.gray.muted"
      zIndex={3}
    >
      <Box marginLeft="spacing.7">
        <a href="https://razorpay.com" target="_blank">
          <img src="/assets/rzp.svg" height="30px" alt="Razorpay" />
        </a>
      </Box>
      <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
        <Box display="flex" columnGap="spacing.3">
          <Dropdown selectionType="single" _width="100px">
            <SelectInput
              label=""
              value={selectedLanguage}
              onChange={({ values }) => {
                setSelectedLanguage(values[0]);
                setSidebarItems(NAV_ITEMS_MAP[values[0]]);
                handleLoader();
                navigate(`/i18nify-${values[0].toLowerCase()}`);
              }}
            />

            <DropdownOverlay>
              <ActionList>
                {Object.values(LANGUAGES).map((value) => {
                  return (
                    <ActionListItem title={value} value={value} key={value} />
                  );
                })}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
          <Dropdown selectionType="single">
            <SelectInput
              label=""
              value={i18nState.locale}
              onChange={({ values }) => {
                setI18nState({ locale: values[0] });
                handleLoader();
              }}
            />
            <DropdownOverlay>
              <ActionList>
                {LANGS.map((lang) => {
                  return (
                    <ActionListItem
                      title={lang.label}
                      key={lang.value}
                      value={lang.value}
                      leading={<img src={lang.icon} alt="" />}
                    />
                  );
                })}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </BladeProvider>
      {isMobile && (
        <Button
          onClick={toggleMobileNav}
          variant="secondary"
          icon={MenuIcon}
          aria-label="Toggle Navigation"
          marginBottom="spacing.4"
        />
      )}
    </Box>
  );
};

export default Header;
