import React, { useMemo, useState } from 'react';
import { type FormPage } from '../../../types';
import { isTrue } from '../../../utils/boolean-utils';
import { useTranslation } from 'react-i18next';
import { SectionRenderer } from '../section/section-renderer.component';
import { Waypoint } from 'react-waypoint';
import styles from './page.renderer.scss';
import { Accordion, AccordionItem } from '@carbon/react';
import { ChevronDownIcon, ChevronUpIcon } from '@openmrs/esm-framework';
import { pageObserver } from '../../sidebar/page-observer';

interface PageRendererProps {
  page: FormPage;
}

function PageRenderer({ page }: PageRendererProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const visibleSections = page.sections.filter((section) => {
    const hasVisibleQuestions = section.questions.some((question) => !isTrue(question.isHidden));
    return !isTrue(section.isHidden) && hasVisibleQuestions;
  });

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div>
      <Waypoint onEnter={() => pageObserver.setCurrentActivePage(page.id)} topOffset="50%" bottomOffset="60%">
        <div id={page.id} className={styles.pageContent}>
          <div className={styles.pageHeader} onClick={toggleCollapse}>
            <p className={styles.pageTitle}>
              {t(page.label)}
              <span className={styles.collapseIconWrapper}>
                {isCollapsed ? (
                  <ChevronDownIcon className={styles.collapseIcon} aria-label="Expand" />
                ) : (
                  <ChevronUpIcon className={styles.collapseIcon} aria-label="Collapse" />
                )}
              </span>
            </p>
          </div>
          {!isCollapsed && (
            <Accordion>
              {visibleSections.map((section) => (
                <AccordionItem
                  title={t(section.label)}
                  open={true}
                  className={styles.sectionContainer}
                  key={`section-${section.label}`}>
                  <div className={styles.formSection}>
                    <SectionRenderer section={section} />
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </Waypoint>
    </div>
  );
}

export default PageRenderer;
