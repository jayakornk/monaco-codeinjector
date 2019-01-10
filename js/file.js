// Type your JavaScript code here.

// Init new editor
require.config({
  paths: {
      'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs'
  }
});

window.MonacoEnvironment = {
  getWorkerUrl: function(workerId, label) {
  return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
      self.MonacoEnvironment = {
      baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor/min'
      };
      importScripts('https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/base/worker/workerMain.js');`
  )}`;
  }
};
function initNewEditor(id, textarea, selector, saveSelector) {
  // remove old editor
  if (id === 'customize_custom_css') {
      document.querySelector('.CodeMirror').CodeMirror.toTextArea();
  } else {
      var oldEditor = ace.edit(id);
      oldEditor.destroy();
      oldEditor.container.remove();
  }

  jQuery(selector).after('<div id="' + id + '"></div>');
  var lang;
  if (id === 'custom_per_page_css_editor') {
      lang = 'css';
  } else if (id === 'customize_custom_css') {
      lang = 'less';
      jQuery('#customize_custom_css').on('keydown', function(e) {
          if (e.keyCode === 27) {
              e.stopPropagation();
          }
      });
  } else if (textarea.val().indexOf('</') !== -1 || textarea.val().indexOf('/>') !== -1) {
      lang = 'html';
  } else {
      lang = 'javascript';
  }

  require(['vs/editor/editor.main'], function() {
      var editor = monaco.editor.create(document.getElementById(id), {
          value: textarea.val(),
          language: lang,
          theme: 'vs-dark',
          fontFamily: 'Dank Mono',
          fontSize: 15,
          lineHeight: 15 * 1.4,
          fontLigatures: true,
          automaticLayout: true,
          renderWhitespace: 'boundary',
          emptySelectionClipboard: true,
          // rulers: [80],
          useTabStops: true,
      });
      console.log(editor);
      // console.log(editor.getActions());

      monaco.languages.html.htmlDefaults.options.format.tabSize = 2;
      monaco.languages.html.htmlDefaults.options.format.insertSpaces = true;

      editor.getModel().updateOptions({
          tabSize: 4,
          insertSpaces: true,
      });

      monaco.languages.registerCompletionItemProvider('less', {
          provideCompletionItems: () => {
              return [
                  {
                      label: 'font-size',
                      kind: monaco.languages.CompletionItemKind.Snippet,
                      documentation: 'Insert font size',
                      detail: 'Insert font size into Custom CSS',
                      insertText: {
                          value: [
                              '.font-$0 {',
                              '\tfont-size: $0px;',
                              '}'
                          ].join('\n')
                      },
                      filterText: '.f'
                  }, {
                      label: 'flex fill',
                      kind: monaco.languages.CompletionItemKind.Snippet,
                      documentation: 'Insert prefixed for flex',
                      detail: 'Flex Fill',
                      insertText: {
                          value: [
                              '-webkit-box-flex: 1;',
                              '-webkit-flex: 1 1 auto;',
                              '-ms-flex: 1 1 auto;',
                              'flex: 1 1 auto;',
                          ].join('\n')
                      },
                      filterText: 'ffill'
                  }
              ]
          }
      });

      editor.addAction({
          id: 'save',
          label: 'Save Content',
          keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
          precondition: null,
          keybindingContext: null,
          run: function(e) {
              textarea.val(e.getValue());
              textarea.trigger('change');
              jQuery(saveSelector).trigger('click');
          }
      });

      editor.addAction({
          id: 'sort ascending',
          label: 'Sort line in ascending order',
          keybindings: [
              monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_K, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_L)
          ],
          precondition: null,
          keybindingContext: null,
          run: function(e) {
              e.trigger('', 'editor.action.sortLinesAscending', {});
          }
      });

      editor.onDidBlurEditorText(function(e) {
          textarea.val(editor.getValue());
          textarea.trigger('change');
      });

      editor.onKeyUp(function(a) {
          textarea.val(editor.getValue());
          textarea.trigger('change');
      });
  });
}

if (jQuery('#custom_per_page_css_editor').attr('id')) {
  console.log('Custom CSS Per Page');
  var textarea = jQuery('textarea[name="custom_per_page_css"]');
  var newEditor = initNewEditor('custom_per_page_css_editor', textarea, 'textarea[name="custom_per_page_css"]', '#publish');
} else if (jQuery('#snippet_ace_editor').attr('id')) {
  console.log('Code Snippet');
  var textarea = jQuery('textarea[name="content"]');
  var newEditor = initNewEditor('snippet_ace_editor', textarea, '#postdivrich', '#publish');
} else if (jQuery('textarea.for-codemirror').length > 0) {
  console.log('Custom CSS Customize');
  var textarea = jQuery('textarea.for-codemirror');
  var newEditor = initNewEditor('customize_custom_css', textarea, 'textarea.for-codemirror', '#save');
} else if (jQuery('textarea.code').length > 0) {
  console.log('Custom CSS Customize');
  var textarea = jQuery('textarea.code');
  var newEditor = initNewEditor('customize_custom_css', textarea, 'textarea.code', '#save');
}