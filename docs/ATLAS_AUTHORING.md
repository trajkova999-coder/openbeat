# Contributing a case

The atlas opens by default with eight original synthetic vignettes and six-second illustrative ECG plates. All are draft educational content pending clinician review.

Add typed content in `lib/atlas.ts`: a stable ID, chapter, neutral title, vignette, question and answer index, interpretation, timed findings, pitfall, related IDs and authoritative source. Annotation bounds are milliseconds within 0–6000. Do not include patient records or copied clinical images.

The atlas generator is separate from the interactive heart lab. Its bradycardia and tachycardia rates are 48 and 110 bpm; the heart lab remains restricted to 50–90 bpm. Only normal conduction, first-degree AV block and Wenckebach link into the lab. The lab does not animate other atlas rhythms.

Challenge mode conceals interpretation until revealed. Comparison explicitly shows both diagnoses. Case links use `?case=ID`.

Extend the event model and tests for new patterns. Verify timing, morphology, answers, annotations and links. Seek documented clinician review before changing draft status. The grid is decorative, not clinically calibrated.
