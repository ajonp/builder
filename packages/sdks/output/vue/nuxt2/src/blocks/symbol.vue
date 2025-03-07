<template>
  <div
    v-bind="attributes"
    :dataSet="{
      class: className,
    }"
    :class="_classStringToObject(this.className)"
  >
    <render-content
      :apiKey="builderContext.apiKey"
      :context="builderContext.context"
      :data="{
        ...(symbol && symbol.data),
        ...builderContext.state,
        ...(symbol &&
          symbol.content &&
          (symbol && symbol.content).data &&
          (symbol && symbol.content && (symbol && symbol.content).data).state),
      }"
      :model="symbol && symbol.model"
      :content="content"
    ></render-content>
  </div>
</template>
<script>
import RenderContent from '../components/render-content';
import BuilderContext from '../context/builder.context';
import { getContent } from '../functions/get-content';

import { registerComponent } from '../functions/register-component';

export default registerComponent(
  {
    name: 'builder-symbol',
    components: { 'render-content': async () => RenderContent },
    props: ['symbol', 'attributes'],

    data: () => ({ className: 'builder-symbol', content: null }),

    inject: {
      builderContext: 'BuilderContext',
    },

    mounted() {
      this.content = this.symbol?.content;
    },
    watch: {
      onUpdateHook() {
        const symbol = this.symbol;

        if (symbol && !symbol.content && !this.content && symbol.model) {
          getContent({
            model: symbol.model,
            apiKey: this.builderContext.apiKey,
            options: {
              entry: symbol.entry,
            },
          }).then((response) => {
            this.content = response;
          });
        }
      },
    },

    computed: {
      onUpdateHook() {
        return `${this.symbol?.content}|${this.symbol?.model}|${this.symbol?.entry}|${this.content}`;
      },
    },

    methods: {
      _classStringToObject(str) {
        const obj = {};
        if (typeof str !== 'string') {
          return obj;
        }
        const classNames = str.trim().split(/\s+/);
        for (const name of classNames) {
          obj[name] = true;
        }
        return obj;
      },
    },
  },
  {
    name: 'Symbol',
    noWrap: true,
    static: true,
    inputs: [
      { name: 'symbol', type: 'uiSymbol' },
      {
        name: 'dataOnly',
        helperText: "Make this a data symbol that doesn't display any UI",
        type: 'boolean',
        defaultValue: false,
        advanced: true,
        hideFromUI: true,
      },
      {
        name: 'inheritState',
        helperText: 'Inherit the parent component state and data',
        type: 'boolean',
        defaultValue: false,
        advanced: true,
      },
      {
        name: 'renderToLiquid',
        helperText:
          'Render this symbols contents to liquid. Turn off to fetch with javascript and use custom targeting',
        type: 'boolean',
        defaultValue: false,
        advanced: true,
        hideFromUI: true,
      },
      { name: 'useChildren', hideFromUI: true, type: 'boolean' },
    ],
  }
);
</script>
