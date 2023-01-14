import {tv} from '../src/index.js';

const menu = tv({
  base: ['font-bold', 'text-red-500'],
  slots: ['trigger', 'menu', 'item'],
  variants: {
    background: {
      primary: {
       trigger: "12312"
      },
      secondary: "bg-purple-500",
    },
    color: {
      primary: "text-blue-500",
      secondary: "text-purple-500",
    },
    size: {
      small: "text-sm",
      medium: "text-lg",
      large: "text-xl",
    } 
  }, 
  defaultVariants: {
    background: "primary",
    color: "primary",
    size: "large"
  },
  compoundVariants: [
    {
      background: "primary",
      size:"medium",
      class: {
        trigger: "bg-blue-500 text-blue-500",
      }
    }
  ]
})


// const menuRoot = tv(
//   {
//     base: "base-styles",
//     slots: ["trigger", "menu", "item"],
//     variants: {
//       normal: {
//         true: "variants-normal-true",
//         false: "variants-normal-false",
//       },
//       color: {
//         primary: {
//           base: "variants-color-primary-base",
//           trigger: "variants-color-primary-trigger",
//           menu: "variants-color-primary-menu",
//           item: "variants-color-primary-item",
//         },
//         secondary: "variants-color-secondary",
//       },
//       size: {
//         small: "variants-size-small",
//         medium: "variants-size-medium",
//       },
//     },
//     compoundVariants: [
//       {
//         normal: true,
//         color: "primary",
//         class: "compound-normal-primary",
//       },
//       {
//         color: "primary",
//         size: "medium",
//         class: {
//           base: "compound-primary-medium-base",
//           trigger: "compound-primary-medium-trigger",
//           menu: "compound-primary-medium-menu",
//           item: "compound-primary-medium-item",
//         },
//       },
//       {
//         color: "secondary",
//         size: "small",
//         className: {
//           base: "compound-secondary-small-base",
//           trigger: "compound-secondary-small-trigger",
//           menu: "compound-secondary-small-menu",
//           item: "compound-secondary-small-item",
//         },
//       },
//     ],
//     defaultVariants: {
//       color: "primary",
//       size: "medium",
//     },
//   },
//   // config
//   {
//     twMerge: true,
//   },
// );

// const menuWithoutSlots = tv(
//   {
//     base: "font-bold",
//     variants: {
//       normal: {
//         true: "variants-normal-true",
//         false: "variants-normal-false",
//       },
//       color: {
//         primary: "color-primary-base",
//         secondary: "color-secondary",
//       },
//       size: {
//         small: "size-small",
//         medium: "size-medium",
//       },
//     },
//     compoundVariants: [
//       {
//         color: "primary",
//         size: "medium",
//         class: "compound-primary-medium",
//       },
//       {
//         color: "secondary",
//         size: "small",
//         class: "compound-secondary-small",
//       },
//       {
//         normal: true,
//         size: "medium",
//         class: "compound-normal-medium",
//       },
//     ],
//     defaultVariants: {
//       color: "primary",
//       size: "medium",
//     },
//   },
//   {
//     twMerge: false,
//   },
// );

// // console.log(menuRoot({normal: true}));

// // print the excecution time of the tv function
// console.time("tv-process-with-slots");
// const {base, trigger, menu, item} = menuRoot({normal: true});

// console.timeEnd("tv-process-with-slots");

// console.log("base ---->", base());
// console.log("trigger ---->", trigger());
// console.log("menu ---->", menu());
// console.log("item ---->", item());

// console.log("--------------------");

// console.time("tv-process-without-slots");
// const menuWoSlots = menuWithoutSlots({normal: true});

// console.timeEnd("tv-process-without-slots");

// console.log("menuWoSlots ---->", menuWoSlots);




