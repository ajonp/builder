/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Builder } from '@builder.io/sdk';

import React, { Fragment, useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { htmlToMarkdown, markdownToHtml } from './Parser';
import { Dialog, DialogContent, withStyles } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ReactQuill from 'react-quill';

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
];

interface TextProps {
  value: string;
  onChange: (value?: string) => void;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: { children: any; value: number; index: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Fragment>{children}</Fragment>}
    </div>
  );
}

function MarkdownEditor(props: TextProps) {
  const [show, setShow] = useState(true);
  const [value, setValue] = React.useState(0);

  const [markdown, setMarkdown] = useState<string>(htmlToMarkdown(props.value || ''));

  useEffect(() => {
    if (props.onChange) {
      const html = markdownToHtml(markdown);
      console.log('html', html);
      props.onChange(html);
    }
  }, [markdown]);

  const toMarkdown = (content?: string) => {
    if (content) {
      setMarkdown(content);
    }
  };

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <Dialog
        open={show}
        fullWidth={true}
        onClose={() => setShow(false)}
        maxWidth="lg"
        onRendered={() => {}}
      >
        <MuiDialogTitle disableTypography>
          <IconButton aria-label="close" onClick={() => setShow(false)}>
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>

        <DialogContent dividers>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Rich Text" {...a11yProps(0)} />
              <Tab label="Markdown" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <ReactQuill
              theme="snow"
              value={props.value}
              onChange={props.onChange}
              modules={modules}
              formats={formats}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <MDEditor value={markdown} onChange={toMarkdown} />
          </TabPanel>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

Builder.registerEditor({
  /**
   * Here we override the built-in richtext editor.
   */
  name: 'html',
  component: MarkdownEditor,
});
