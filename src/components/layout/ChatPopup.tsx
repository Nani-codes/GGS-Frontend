"use client";

import { useTranslations } from 'next-intl';
import { FORM_CONFIG } from '@/config/constants';

export function ChatPopup() {
  const t = useTranslations();
  
  return (
    <>
      <div className="chat-icon">
        <button type="button" className="chat-toggler">
          <i className="fa fa-comment" />
        </button>
      </div>
      <div id="chat-popup" className="chat-popup">
        <div className="popup-inner">
          <div className="close-chat"><i className="fa fa-times" /></div>
          <div className="chat-form">
            <p>{t('sidebar.pleaseFillForm')}</p>
            <form action={FORM_CONFIG.chatFormAction} method="POST" className="contact-form-validated">
              <div className="form-group">
                <input type="text" name="name" placeholder={t('contact.yourName')} required />
              </div>
              <div className="form-group">
                <input type="email" name="email" placeholder={t('contact.yourEmail')} required />
              </div>
              <div className="form-group">
                <textarea name="message" placeholder={t('contact.yourText')} required defaultValue={""} />
              </div>
              <div className="form-group message-btn">
                <button type="submit" className="thm-btn">
                  {t('common.submitNow')}
                  <i className="fal fa-long-arrow-right" />
                  <span className="hover-btn hover-bx" />
                  <span className="hover-btn hover-bx2" />
                  <span className="hover-btn hover-bx3" />
                  <span className="hover-btn hover-bx4" />
                </button>
              </div>
              <div className="result" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

