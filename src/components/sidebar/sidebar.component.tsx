import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { type FormPage } from '../../types';
import styles from './sidebar.scss';
import { scrollIntoView } from '../../utils/form-helper';
import { pageObserver } from './page-observer';

interface SidebarProps {
  defaultPage: string;
  handleClose: () => void;
  hideFormCollapseToggle: () => void;
  isFormSubmitting: boolean;
  mode: string;
  onCancel: () => void;
  pagesWithErrors: string[];
  scrollablePages: Set<FormPage>;
  selectedPage: string;
  setValues: (values: unknown) => void;
  values: object;
}

const Sidebar: React.FC<SidebarProps> = ({
  defaultPage,
  isFormSubmitting,
  mode,
  pagesWithErrors,
  scrollablePages,
  onCancel,
  handleClose,
  hideFormCollapseToggle,
}) => {
  const { t } = useTranslation();
  const [pages, setPages] = useState<Array<FormPage>>([]);
  const [currentActivePage, setCurrentActivePage] = useState<string | null>(null);
  useEffect(() => {
    const scrollablePagesSubscription = pageObserver.getScrollablePagesObservable().subscribe((pages) => {
      setPages(pages);
    });

    const pagesWithErrorsSubscription = pageObserver.getPagesWithErrorsObservable().subscribe((errors) => {
      console.log('Pages with Errors:', errors);
    });

    const currentActivePageSubscription = pageObserver.getCurrentActivePageObservable().subscribe((pageId) => {
      console.log('Current Active Page:', pageId);
      setCurrentActivePage(pageId);
    });

    return () => {
      scrollablePagesSubscription.unsubscribe();
      pagesWithErrorsSubscription.unsubscribe();
      currentActivePageSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (defaultPage && pages.some(({ label, isHidden }) => label === defaultPage && !isHidden)) {
      scrollIntoView(joinWord(defaultPage));
    }
  }, [defaultPage, scrollablePages]);

  const handleClick = (selectedPage) => {
    scrollIntoView(selectedPage);
  };

  return (
    <div className={styles.sidebar}>
      {pages.map((page, index) => {
        if (page.isHidden) return null;

        const isCurrentlySelected = page.id === currentActivePage;
        const hasError = pagesWithErrors.includes(page.label);

        return (
          <div
            aria-hidden="true"
            className={classNames({
              [styles.erroredSection]: isCurrentlySelected && hasError,
              [styles.activeSection]: isCurrentlySelected && !hasError,
              [styles.activeErroredSection]: !isCurrentlySelected && hasError,
              [styles.section]: !isCurrentlySelected && !hasError,
            })}
            key={index}
            onClick={() => handleClick(page.id)}>
            <div className={styles.sectionLink}>{page.label}</div>
          </div>
        );
      })}
      {mode !== 'view' && <hr className={styles.divider} />}
      <div className={styles.sidenavActions}>
        {mode !== 'view' && (
          <Button className={styles.saveButton} disabled={isFormSubmitting} type="submit">
            {t('save', 'Save')}
          </Button>
        )}
        <Button
          className={classNames(styles.saveButton, {
            [styles.topMargin]: mode === 'view',
          })}
          kind="tertiary"
          onClick={() => {
            onCancel?.();
            handleClose?.();
            hideFormCollapseToggle();
          }}>
          {mode === 'view' ? t('close', 'Close') : t('cancel', 'Cancel')}
        </Button>
      </div>
    </div>
  );
};

function joinWord(value) {
  return value.replace(/\s/g, '');
}

export default Sidebar;
