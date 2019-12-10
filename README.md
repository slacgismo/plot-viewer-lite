# plot-viewer-lite
A plot viewer that isn't reliant on any backend.

## Setting Up JSON
When JSON file is setup, make sure the first object has the same keys as the rest of the objects and the values of the keys are chosen as:
ignore - if the key does not indicate anything
option - if the key is one of the desired sort/filter options
display - if the the key is used for the urls of the objects that are being intended to be displayed
download - if the the key is used for the urls of the dataset relating the the displayed items
(example: https://s3-us-west-1.amazonaws.com/lctk.data/derin-test/alm_plots.json)

## Running Plot Viewer lite
```
open index.html
```
# plot-viewer-lite
