# NASA network diagnosis

**Historical record:** The former NASA acquisition blocker is resolved in the new published instance. Authentic data is included and the data gate passes; see [current acquisition and verification](authentic-data-verification.md). The text below records the earlier instance, not current readiness.

## Evidence from this continuation session

The saved draft (revision 3) already contains `power.larc.nasa.gov` and `www.spaceappschallenge.org`. No duplicate domain additions or network-policy changes were made. The running instance, however, reports **observed revision 1**, enforced restricted networking, and no custom allowed hosts; neither destination appears in its effective allowlist. Thus the saved intent and observed runtime differ.

One documentation request and one valid monthly point API request were attempted via the configured HTTPS proxy. Both returned:

```text
curl: (56) CONNECT tunnel failed, response 403
HTTP/1.1 403 Forbidden
content-type: text/plain
content-length: 16
server: envoy
connection: close
```

The valid query used `/api/temporal/monthly/point`, parameters `T2M,PRECTOTCORR`, community `AG`, latitude 49.10, longitude -122.66, start 1991, end 2024, JSON format. No access-denied retry loop was run. The downloader now also stops immediately when urllib reports a proxy tunnel 403/407.

**Conclusion:** these observed failures originate in the proxy path before NASA HTTPS is established. They are not evidence of a NASA API rejection, invalid parameters, NASA rate limiting or missing NASA credentials. Runtime policy lag/mismatch is supported by the status metadata, but the precise provider-side propagation cause cannot be established from available tools. No retained provider diagnostic records were available. Local `getent ahosts power.larc.nasa.gov` returned no records; because the platform proxy can resolve destinations remotely, this does not independently establish a NASA DNS outage. NASA TLS/certificate validity and upstream HTTP status could not be inspected: CONNECT was rejected first. No TLS verification was disabled, direct egress attempted or credentials requested.

## Official alternatives considered

The NASA POWER documentation and point endpoints share the denied host, so changing temporal routes cannot resolve a pre-TLS denial. Public GitHub lookups for `NASA-POWER/POWER-API` and `POWER-Project` did not establish an accessible official distribution (repository/page not found); these guesses were not treated as authorities. No compatible official raw archive was located. Other Earthdata/reanalysis products cannot be silently substituted for POWER: grids, bias corrections, variables, units and often access mechanisms differ. The official POWER live schema and challenge text remain unverified from this instance.

The next cloud-level diagnostic is to reconcile the already-configured draft with the observed running-instance revision through the platform lifecycle/support, rather than adding the same domains again. While that remains unresolved, use the Bazzite acquisition and offline import procedure in [local data transfer](local-data-transfer.md). There is no authentic dataset or verified climate discovery in this checkout yet.
