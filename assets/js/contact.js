/* ==========================================================
   contact.js — お問い合わせフォームの入力チェック
   送信先は未設定のため、確認用に完了メッセージを表示する。
   本番では送信処理（PHP / フォームサービス等）に差し替える。
   ========================================================== */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var done = document.getElementById('contact-done');

  // TOP の窓口から来たとき（?type=listing など）は、種類を選んだ状態にする
  var typeSelect = document.getElementById('contact-type');
  var typeParam = (new URLSearchParams(window.location.search).get('type') || '').replace(/[^a-z]/g, '');
  if (typeSelect && typeParam && typeSelect.querySelector('option[value="' + typeParam + '"]')) {
    typeSelect.value = typeParam;
  }

  var messages = {
    valueMissing: 'この項目を入力してください。',
    typeMismatch: 'メールアドレスの形式で入力してください（例：name@example.com）。',
    agree: 'プライバシーポリシーへの同意が必要です。'
  };

  function errorFor(field) {
    return document.getElementById(field.id + '-error');
  }

  function check(field) {
    var error = errorFor(field);
    var text = '';
    if (field.validity.valueMissing) {
      text = field.type === 'checkbox' ? messages.agree : messages.valueMissing;
    } else if (field.validity.typeMismatch) {
      text = messages.typeMismatch;
    }
    field.setAttribute('aria-invalid', text ? 'true' : 'false');
    if (error) {
      error.textContent = text;
      error.hidden = !text;
    }
    return !text;
  }

  var fields = form.querySelectorAll('[required]');

  fields.forEach(function (field) {
    field.addEventListener('blur', function () {
      check(field);
    });
    field.addEventListener('change', function () {
      if (field.getAttribute('aria-invalid') === 'true') check(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    fields.forEach(function (field) {
      if (!check(field) && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    form.hidden = true;
    if (done) {
      done.hidden = false;
      done.focus();
    }
  });
})();
